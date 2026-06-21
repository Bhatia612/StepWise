const Anthropic = require("@anthropic-ai/sdk");
const Explanation = require("../models/explanation.model");
const { redisClient } = require("../config/redis");

const client = new Anthropic.Anthropic();

const explainProblem = async (req, res, next) => {
  try {
    const { problem } = req.body;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a DSA thinking coach. Analyze the following problem and explain it step by step — without writing actual code.

This problem could involve arrays, strings, trees, graphs, recursion, dynamic programming, or any other domain. Read it carefully and tailor your sections to what this specific problem actually needs. Do not force the same section titles on every problem.

Include a "trace" — a concrete walkthrough using one small example. Adapt the trace to whatever the problem actually is: array index and value for array problems, current node and call stack for tree/recursion problems, current cell for DP, current node and queue for graph traversal, etc. Each trace step should have a short "step" label and a "detail" explaining what happens and why. Include 2 to 5 trace steps — only as many as needed to reach the answer, not padding.

Return ONLY valid JSON, no markdown fences, in this exact shape:
{
  "pattern": "short name of the technique or pattern used",
  "difficulty": "easy, medium, or hard",
  "sections": [
    { "title": "section title relevant to this problem", "content": "explanation for this section" }
  ],
  "trace": [
    { "step": "short label for this step", "detail": "what happens at this step and why" }
  ],
  "traceNote": "one short closing line summarizing why this trace works or is efficient",
  "pitfalls": ["common mistake or edge case 1", "common mistake or edge case 2"],
  "complexity": {
    "time": "Big-O time complexity",
    "timeReason": "why the time complexity is what it is",
    "space": "Big-O space complexity",
    "spaceReason": "why the space complexity is what it is"
  }
}

Include 2 to 4 sections, whatever genuinely fits this problem. Include 2 to 4 pitfalls.

Problem: ${problem}`,
        },
      ],
    });

    const raw = message.content[0].text;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const explanationData = {
      problem,
      pattern: parsed.pattern,
      difficulty: parsed.difficulty,
      sections: parsed.sections,
      trace: parsed.trace,
      traceNote: parsed.traceNote,
      pitfalls: parsed.pitfalls,
      complexity: parsed.complexity,
      createdAt: new Date().toISOString(),
    };

    if (req.user) {
      const saved = await Explanation.create({
        ...explanationData,
        userId: req.user._id,
      });

      return res.status(200).json({
        success: true,
        data: saved,
      });
    }

    const redisKey = `guest:${req.guestSessionId}`;
    const existing = await redisClient.get(redisKey);
    const history = existing ? JSON.parse(existing) : [];

    const entryWithId = { _id: `guest-${Date.now()}`, ...explanationData };
    history.unshift(entryWithId);

    await redisClient.set(redisKey, JSON.stringify(history), {
      EX: 24 * 60 * 60,
    });

    res.status(200).json({
      success: true,
      data: entryWithId,
    });
  } catch (error) {
    next(error);
  }
};

const getAllExplanations = async (req, res, next) => {
  try {
    if (req.user) {
      const explanations = await Explanation.find({ userId: req.user._id }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: explanations,
      });
    }

    const redisKey = `guest:${req.guestSessionId}`;
    const existing = await redisClient.get(redisKey);
    const history = existing ? JSON.parse(existing) : [];

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const getExplanationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const explanation = await Explanation.findById(id);

    if (!explanation) {
      return res.status(404).json({
        success: false,
        message: "Explanation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { explainProblem, getAllExplanations, getExplanationById };