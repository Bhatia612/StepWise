const express = require("express");
const explainController = require("../controllers/explain.controller");
const { validateExplainRequest } = require('../middlewares/validate.middleware')
const auth = require("../middlewares/auth.middleware")


const explainRoutes = express.Router();

explainRoutes.post("/explain", auth, validateExplainRequest, explainController.explainProblem);

explainRoutes.get("/explanations", auth, explainController.getAllExplanations);

explainRoutes.get("/explanations/:id", auth, explainController.getExplanationById);

module.exports = explainRoutes;