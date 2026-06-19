const express = require("express");
const { explainProblem } = require("../controllers/explain.controller");

const router = express.Router();

router.post("/explain", explainProblem);

module.exports = router;