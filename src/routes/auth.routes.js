import { Router } from "express";

// controllers
import {
    registerUser,
    login,
    logoutUser,
    verifyEmail,
    refreshaccessToken,
    forgotpasswordRequest,
    resendEmailVerification,
    changeCurrentPassword,
    getCurrentUser
} from "../controllers/auth.controllers.js";

// middlewares
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { valid } from "../middlewares/validate.js";

// validators
import {
    userRegisterValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userChangeCurrentPasswordValidator
} from "../validators/index.js";

const router = Router();

/* ================= AUTH ROUTES ================= */

// Register
router.post(
    "/register",
    userRegisterValidator(),
    valid,
    registerUser
);

// Login
router.post(
    "/login",
    userLoginValidator(),
    valid,
    login
);

// Verify email
router.get(
    "/verify-email/:verificationToken",
    verifyEmail
);

// Refresh access token
router.post(
    "/refresh-token",
    refreshaccessToken
);

// Forgot password
router.post(
    "/forgot-password",
    userForgotPasswordValidator(),
    valid,
    forgotpasswordRequest
);

// Logout (protected)
router.post(
    "/logout",
    verifyJWT,
    logoutUser
);

// Get current user (protected)
router.get(
    "/current-user",
    verifyJWT,
    getCurrentUser
);

// Change current password (protected)
router.post(
    "/change-password",
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    valid,
    changeCurrentPassword   // ✅ CORRECT
);


// Resend email verification (protected)
router.post(
    "/resend-email-verification",
    verifyJWT,
    resendEmailVerification
);

export default router;
