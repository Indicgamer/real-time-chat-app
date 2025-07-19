import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User successfully created
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingFields:
 *                 summary: Missing required fields
 *                 value:
 *                   message: "All fields are required"
 *               shortPassword:
 *                 summary: Password too short
 *                 value:
 *                   message: "Password must be at least 6 characters"
 *               emailExists:
 *                 summary: Email already exists
 *                 value:
 *                   message: "Email already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/signup", signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid credentials"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and clear authentication cookie
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *             example:
 *               message: "Logged out successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/update-profile:
 *   put:
 *     summary: Update user profile picture
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing profile picture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Profile pic is required"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/update-profile", protectRoute, updateProfile);

/**
 * @swagger
 * /auth/check:
 *   get:
 *     summary: Check if user is authenticated and get user data
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               noToken:
 *                 summary: No token provided
 *                 value:
 *                   message: "Unauthorized - No Token Provided"
 *               invalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   message: "Unauthorized - Invalid Token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/check", protectRoute, checkAuth);

export default router;
