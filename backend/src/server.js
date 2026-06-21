require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const errorHandler = require("./middlewares/error.middleware")

const explainRoutes = require("./routes/explain.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "StepWise is running" });
});

app.use("/api/v1", explainRoutes);

app.use("/api/v1/auth", authRoutes);


app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});