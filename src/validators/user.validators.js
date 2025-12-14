import { body } from "express-validator";

export const userRegisterValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),

    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .custom(value => value === value.toLowerCase())
        .withMessage("Username must be in lowercase")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("fullName")
        .optional()
        .trim(),
];
