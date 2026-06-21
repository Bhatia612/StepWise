const validateSignup = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !identifier.trim()) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};

module.exports = { validateSignup, validateLogin };