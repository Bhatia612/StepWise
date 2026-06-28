const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const migrateGuestHistory = require("../utils/migrateGuestHistory")

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    })
}

const setAuthCookies = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

const signUpController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        const existingUser = await User.findOne({ $or: [{ username }, { email }] })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already in use",
            });
        }

        const user = await User.create({
            username,
            email,
            password
        })

        const guestSessionId = req.cookies.guestSessionId
        const migratedCount = await migrateGuestHistory(guestSessionId, user._id)

        if (guestSessionId) {
            res.clearCookie("guestSessionId")
        }

        const token = generateToken(user._id)
        setAuthCookies(res, token)

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            migratedExplanations: migratedCount
        })
    } catch (error) {
        next(error)
    }
}

const logInController = async (req, res, next) => {
    try {
        const { identifier, password } = req.body

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user._id);
        setAuthCookies(res, token);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        next(error)
    }
}

const getMeController = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        }
    })
}

const logOutController = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = { signUpController, logInController, logOutController, getMeController };