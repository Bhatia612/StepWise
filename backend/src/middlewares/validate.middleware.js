const validateExplainRequest = (req, res, next) => {
    const { problem } = req.body

    if (!problem || problem.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Problem text is required",
        });
    }

    next()
}

module.exports = { validateExplainRequest };