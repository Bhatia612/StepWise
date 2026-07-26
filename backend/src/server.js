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
  const paymentRoutes = require("./routes/payment.routes");

  const allowedOrigins = [
    "http://localhost:5173",
    "https://step-wise-sooty.vercel.app",
  ];

  app.use(cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }));

  app.post(
    "/api/v1/payments/webhook",
    express.raw({ type: "application/json" }),
    require("./controllers/payment.controller").handleWebhook
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.json({ message: "StepWise is running" });
  });

  app.use("/api/v1", explainRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/payments", paymentRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();