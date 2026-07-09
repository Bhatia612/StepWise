const Anthropic = require("@anthropic-ai/sdk");
const Explanation = require("../models/explanation.model");
const { redisClient } = require("../config/redis");

const client = new Anthropic.Anthropic();

const explainProblem = async (req, res, next) => {
  try {
    const { problem } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    let buffer = "";
    let fullText = "";
    const parsed = {};

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a DSA thinking coach. Analyze the following problem and explain it step by step — without writing actual code.

This problem could involve arrays, strings, trees, graphs, recursion, dynamic programming, or any other domain.

You MUST output exactly 6 types of lines in this exact order. Each line is a complete JSON object. Output nothing else — no markdown, no explanation, no code fences.

LINE 1 — always exactly one meta line:
{"type":"meta","pattern":"name of algorithm pattern","difficulty":"easy or medium or hard"}

LINES 2 to 5 — between 2 and 4 section lines:
{"type":"section","title":"title relevant to this problem","content":"explanation"}

LINE 6 — always exactly one trace line:
{"type":"trace","steps":[{"step":"label","detail":"what happens"}],"note":"closing insight"}

LINE 7 — always exactly one pitfalls line:
{"type":"pitfalls","items":["mistake 1","mistake 2"]}

LINE 8 — YOU MUST ALWAYS OUTPUT THIS LINE LAST, IT IS REQUIRED:
{"type":"complexity","time":"O(?)","timeReason":"why","space":"O(?)","spaceReason":"why"}

DO NOT stop after pitfalls. The complexity line is not optional. Always output it.

Problem: ${problem}`,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        const text = chunk.delta.text;
        fullText += text;
        buffer += text;

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const obj = JSON.parse(trimmed);

            if (obj.type === "meta") {
              parsed.pattern = obj.pattern;
              parsed.difficulty = obj.difficulty;
              sendEvent("meta", { pattern: obj.pattern, difficulty: obj.difficulty });
            } else if (obj.type === "section") {
              if (!parsed.sections) parsed.sections = [];
              parsed.sections.push({ title: obj.title, content: obj.content });
              sendEvent("section", { title: obj.title, content: obj.content });
            } else if (obj.type === "trace") {
              parsed.trace = obj.steps;
              parsed.traceNote = obj.note;
              sendEvent("trace", { steps: obj.steps, note: obj.note });
            } else if (obj.type === "pitfalls") {
              parsed.pitfalls = obj.items;
              sendEvent("pitfalls", { items: obj.items });
            } else if (obj.type === "complexity") {
              parsed.complexity = {
                time: obj.time,
                timeReason: obj.timeReason,
                space: obj.space,
                spaceReason: obj.spaceReason,
              };
              sendEvent("complexity", {
                time: obj.time,
                timeReason: obj.timeReason,
                space: obj.space,
                spaceReason: obj.spaceReason,
              });
            }
          } catch (error) {
            if (!res.headersSent) {
              next(error);
            } else {
              sendEvent("error", { message: error.message || "Something went wrong" });
              res.end();
            }
          }
        }
      }
    }

    if (!parsed.complexity) {
      parsed.complexity = {
        time: "Not provided",
        timeReason: "Claude did not return complexity analysis",
        space: "Not provided",
        spaceReason: "Claude did not return complexity analysis",
      };
    }

    console.log("PARSED RESULT:", JSON.stringify(parsed, null, 2));

    const explanationData = {
      problem,
      pattern: parsed.pattern,
      difficulty: parsed.difficulty,
      sections: parsed.sections || [],
      trace: parsed.trace || [],
      traceNote: parsed.traceNote || "",
      pitfalls: parsed.pitfalls || [],
      complexity: parsed.complexity || {},
      createdAt: new Date().toISOString(),
    };

    if (req.user) {
      const saved = await Explanation.create({
        ...explanationData,
        userId: req.user._id,
      });
      sendEvent("done", { data: saved });
    } else {
      const redisKey = `guest:${req.guestSessionId}`;
      const existing = await redisClient.get(redisKey);
      const history = existing ? JSON.parse(existing) : [];
      const entryWithId = { _id: `guest-${Date.now()}`, ...explanationData };
      history.unshift(entryWithId);
      await redisClient.set(redisKey, JSON.stringify(history), {
        EX: 24 * 60 * 60,
      });
      sendEvent("done", { data: entryWithId });
    }

    res.end();
  } catch (error) {
    next(error);
  }
};

const getAllExplanations = async (req, res, next) => {
  try {
    if (req.user) {
      const explanations = await Explanation.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: explanations });
    }

    const redisKey = `guest:${req.guestSessionId}`;
    const existing = await redisClient.get(redisKey);
    const history = existing ? JSON.parse(existing) : [];

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

const getExplanationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const explanation = await Explanation.findById(id);

    if (!explanation) {
      return res.status(404).json({ success: false, message: "Explanation not found" });
    }

    res.status(200).json({ success: true, data: explanation });
  } catch (error) {
    next(error);
  }
};

module.exports = { explainProblem, getAllExplanations, getExplanationById };