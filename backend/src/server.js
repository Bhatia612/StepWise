require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const errorHandler = require("./middlewares/error.middleware");



const app = express();
const PORT = process.env.PORT || 5000;


const startServer = async () => {

  await connectDB();
  await connectRedis();

  const explainRoutes = require("./routes/explain.routes");
  const authRoutes = require("./routes/auth.routes");

  app.use(cors({
    origin: "https://m4lfs77x-5173.use2.devtunnels.ms",
    credentials: true,
  }));

  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.json({ message: "StepWise is running" });
  });

  app.use("/api/v1", explainRoutes);
  app.use("/api/v1/auth", authRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();