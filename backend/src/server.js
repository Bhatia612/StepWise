require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middlewares ---
app.use(cors());
app.use(express.json());

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.json({ message: "StepWise is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});