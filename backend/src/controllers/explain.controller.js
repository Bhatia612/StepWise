const Anthropic = require("@anthropic-ai/sdk");
const Explanation = require("../models/explanation.model");

const client = new Anthropic.Anthropic();

const explainProblem = async (req, res, next) => {

  try {


    const { problem } = req.body;

    if (!problem || problem.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Problem text is required",
      });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a DSA thinking coach. Given the following problem, explain it step by step without giving the code solution.

Return your response in this exact JSON format:
{
  "explanation": "step by step thinking process",
  "approach": "the strategy or pattern used eg two pointers sliding window etc",
  "complexity": {
    "time": "time complexity with reason",
    "space": "space complexity with reason"
  }
}

Problem: ${problem}`,
        },
      ],
    });

    const raw = message.content[0].text;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const saved = await Explanation.create({
      problem,
      explanation: parsed.explanation,
      approach: parsed.approach,
      complexity: parsed.complexity,
    });

    res.status(200).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error)
  }
};

const getAllExplanation = async (req, res, next) => {
  try {
    const explanations = await Explanation.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: explanations
    })
  } catch (error) {
    next(error)
  }
}

const getExplanationById = (req, res, next) => {
  try {
    const { id } = req.params

    const explanation = await Explanation.findById(id)

    if (!explanation) {
      return res.status(404).json({
        success: false,
        message: "Explanation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: explanation
    })
  } catch (error) {
    next(error)
  }

}

module.exports = { explainProblem, getAllExplanation, getExplanationById };