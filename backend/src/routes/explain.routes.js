const express = require("express");
const explainController = require("../controllers/explain.controller");
const { validateExplainRequest } = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const guestSession = require("../middlewares/guestSession.middleware");

const explainRoutes = express.Router();

explainRoutes.post(
  "/explain",
  auth,
  guestSession,
  validateExplainRequest,
  explainController.explainProblem
);

explainRoutes.get(
  "/explanations",
  auth,
  guestSession,
  explainController.getAllExplanations
);

explainRoutes.get(
  "/explanations/:id",
  auth,
  guestSession,
  explainController.getExplanationById
);

module.exports = explainRoutes;