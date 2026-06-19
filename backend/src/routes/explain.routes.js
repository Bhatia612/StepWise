const express = require("express");
const explainController = require("../controllers/explain.controller");
const { validateExplainRequest } = require('../middlewares/validate.middleware')


const explainRoutes = express.Router();

explainRoutes.post("/explain", validateExplainRequest, explainController.explainProblem);

explainRoutes.get("/explanations", explainController.getAllExplanation);

explainRoutes.get("/explanations/:id", explainController.getExplanationById);

module.exports = explainRoutes;