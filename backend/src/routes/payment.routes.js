const express = require("express");
const {
  createCheckoutSession,
  handleWebhook,
  getCreditPacks,
  getUserCredits,
} = require("../controllers/payment.controller");
const protect = require("../middlewares/protect.middleware");

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

router.get("/packs", getCreditPacks);
router.post("/checkout", protect, createCheckoutSession);
router.get("/credits", protect, getUserCredits);

module.exports = router;