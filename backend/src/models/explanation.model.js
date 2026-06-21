const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const traceSchema = new mongoose.Schema(
  {
    step: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false }
);

const explanationSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    pattern: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    sections: {
      type: [sectionSchema],
      required: true,
    },
    trace: {
      type: [traceSchema],
      default: [],
    },
    traceNote: {
      type: String,
      default: "",
    },
    pitfalls: {
      type: [String],
      default: [],
    },
    complexity: {
      time: { type: String, required: true },
      timeReason: { type: String, required: true },
      space: { type: String, required: true },
      spaceReason: { type: String, required: true },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Explanation", explanationSchema);