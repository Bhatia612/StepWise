const express = require("express");
const explainController = require("../controllers/explain.controller");

const explainRoutes = express.Router();

explainRoutes.post("/explain", explainController.explainProblem);

explainRoutes.get("/explanations", explainController.getAllExplanation);

explainRoutes.get("/explanations/:id", explainController.getExplanationById);

module.exports = explainRoutes;