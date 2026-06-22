const express = require("express");
const explainController = require("../controllers/explain.controller");
const { validateExplainRequest } = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const guestSession = require("../middlewares/guestSession.middleware");
const { explainLimiter, generalLimiter } = require("../middlewares/rateLimiter.middleware");

const explainRoutes = express.Router();

explainRoutes.post(
  "/explain",
  explainLimiter,
  auth,
  guestSession,
  validateExplainRequest,
  explainController.explainProblem
);

explainRoutes.get(
  "/explanations",
  generalLimiter,
  auth,
  guestSession,
  explainController.getAllExplanations
);

explainRoutes.get(
  "/explanations/:id",
  generalLimiter,
  auth,
  guestSession,
  explainController.getExplanationById
);

module.exports = explainRoutes;