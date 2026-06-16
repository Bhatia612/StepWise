const mongoose = require("mongoose");

const explanationSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    approach: {
      type: String,
      required: true,
    },
    complexity: {
      time: { type: String, required: true },
      space: { type: String, required: true },
    },
    tags: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Explanation", explanationSchema);