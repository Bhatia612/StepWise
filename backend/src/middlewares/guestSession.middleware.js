const { v4: uuidv4 } = require("uuid");

const guestSession = (req, res, next) => {
  if (req.user) {
    return next();
  }

  let sessionId = req.cookies.guestSessionId;

  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie("guestSessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  req.guestSessionId = sessionId;
  next();
};

module.exports = guestSession;