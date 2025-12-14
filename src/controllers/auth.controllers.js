import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
} from "../utils/mail.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";

/* ================= TOKEN HELPERS ================= */

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);

    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

/* ================= REGISTER ================= */

export const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified: false,
    });

    const { unhashedToken, hashedToken, tokenExpiry } =
        user.generateTemproryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedToken}`
        ),
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

/* ================= LOGIN ================= */

export const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Email or username required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) throw new ApiError(404, "User not found");

    if (!user.isEmailVerified) {
        throw new ApiError(403, "Email not verified");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: user._id },
                "Login successful"
            )
        );
});

/* ================= LOGOUT ================= */

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

/* ================= CURRENT USER ================= */

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.json(
        new ApiResponse(200, req.user, "Current user fetched")
    );
});

/* ================= VERIFY EMAIL ================= */

export const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;

    const hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Token invalid or expired");
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.isEmailVerified = true;

    await user.save({ validateBeforeSave: false });

    return res.json(
        new ApiResponse(200, {}, "Email verified successfully")
    );
});

/* ================= REFRESH TOKEN ================= */

export const refreshaccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    return res
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(new ApiResponse(200, {}, "Token refreshed"));
});
export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});
export const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(404, "User not found");
    if (user.isEmailVerified) {
        throw new ApiError(400, "Email already verified");
    }

    const { unhashedToken, hashedToken, tokenExpiry } =
        user.generateTemproryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedToken}`
        ),
    });

    return res.json(
        new ApiResponse(200, {}, "Verification email resent")
    );
});
export const forgotpasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const { unhashedToken, hashedToken, tokenExpiry } =
        user.generateTemproryToken();

    user.forgotpasswordToken = hashedToken;
    user.forgotpasswordExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Reset your password",
        mailgenContent: forgotPasswordMailgenContent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedToken}`
        ),
    });

    return res.json(
        new ApiResponse(200, {}, "Password reset email sent")
    );
});
