const checkCredits = (req, res, next) => {
    if (!req.user) return next();

    if (req.user.credits <= 0) {
        return res.status(403).json({
            success: false,
            message: "You have no credits remaining.",
            code: "NO_CREDITS",
        });
    }

    next();
};

module.exports = checkCredits;