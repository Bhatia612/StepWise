const stripe = require("../config/stripe");
const User = require("../models/user.model");
const CREDIT_PACKS = require("../config/creditPacks");

const createCheckoutSession = async (req, res, next) => {
  try {
    const { packId } = req.body;

    const pack = CREDIT_PACKS.find((p) => p.id === packId);

    if (!pack) {
      return res.status(400).json({
        success: false,
        message: "Invalid credit pack selected.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pack.name,
              description: pack.description,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        credits: pack.credits.toString(),
        packId: pack.id,
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?credits=${pack.credits}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    res.status(200).json({
      success: true,
      data: { url: session.url },
    });
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).json({ message: `Webhook error: ${error.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, credits } = session.metadata;

    await User.findByIdAndUpdate(userId, {
      $inc: { credits: parseInt(credits) },
    });
  }

  res.status(200).json({ received: true });
};

const getCreditPacks = (req, res) => {
  res.status(200).json({
    success: true,
    data: CREDIT_PACKS,
  });
};

const getUserCredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("credits");
    res.status(200).json({
      success: true,
      data: { credits: user.credits },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getCreditPacks,
  getUserCredits,
};