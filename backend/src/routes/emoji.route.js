import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Emojis
 *   description: Emoji integration and management for chat messages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Emoji:
 *       type: object
 *       properties:
 *         character:
 *           type: string
 *           description: The emoji character
 *           example: "😀"
 *         unicodeName:
 *           type: string
 *           description: The Unicode name of the emoji
 *           example: "grinning face"
 *         category:
 *           type: string
 *           description: The category group of the emoji
 *           example: "smileys-emotion"
 *         slug:
 *           type: string
 *           description: URL-friendly name
 *           example: "grinning-face"
 *         group:
 *           type: string
 *           description: The emoji group classification
 *           example: "face-smiling"
 *     EmojiCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Category identifier
 *           example: "smileys-emotion"
 *         name:
 *           type: string
 *           description: Human-readable category name
 *           example: "Smileys"
 *         icon:
 *           type: string
 *           description: Representative emoji for the category
 *           example: "😀"
 *     EmojiApiConfig:
 *       type: object
 *       properties:
 *         apiKey:
 *           type: string
 *           description: Open Emoji API key
 *           example: "your_api_key_here"
 *         baseUrl:
 *           type: string
 *           description: Base URL for the emoji API
 *           example: "https://emoji-api.com/emojis"
 *         categoriesEnabled:
 *           type: boolean
 *           description: Whether category filtering is enabled
 *           example: true
 *         searchEnabled:
 *           type: boolean
 *           description: Whether emoji search is enabled
 *           example: true
 */

/**
 * @swagger
 * /emojis/config:
 *   get:
 *     summary: Get emoji integration configuration
 *     tags: [Emojis]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Emoji configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiEnabled:
 *                   type: boolean
 *                   description: Whether Open Emoji API is configured
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmojiCategory'
 *                 features:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: boolean
 *                       example: true
 *                     categories:
 *                       type: boolean
 *                       example: true
 *                     fallback:
 *                       type: boolean
 *                       example: false
 *                 limits:
 *                   type: object
 *                   properties:
 *                     perPage:
 *                       type: number
 *                       example: 64
 *                     searchDebounce:
 *                       type: number
 *                       example: 300
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/config", protectRoute, (req, res) => {
  res.json({
    apiEnabled: !!process.env.VITE_EMOJI_API_KEY,
    categories: [
      { id: 'smileys-emotion', name: 'Smileys', icon: '😀' },
      { id: 'people-body', name: 'People', icon: '👋' },
      { id: 'animals-nature', name: 'Nature', icon: '🐶' },
      { id: 'food-drink', name: 'Food', icon: '🍎' },
      { id: 'travel-places', name: 'Travel', icon: '🚗' },
      { id: 'activities', name: 'Activities', icon: '⚽' },
      { id: 'objects', name: 'Objects', icon: '📱' },
      { id: 'symbols', name: 'Symbols', icon: '❤️' },
      { id: 'flags', name: 'Flags', icon: '🏳️' }
    ],
    features: {
      search: true,
      categories: true,
      fallback: false
    },
    limits: {
      perPage: 64,
      searchDebounce: 300
    }
  });
});

/**
 * @swagger
 * /emojis/status:
 *   get:
 *     summary: Check emoji API status and connectivity
 *     tags: [Emojis]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Emoji API status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [connected, disconnected, not_configured]
 *                   example: "connected"
 *                 apiKey:
 *                   type: boolean
 *                   description: Whether API key is configured
 *                   example: true
 *                 lastChecked:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-17T23:30:00.000Z"
 *                 message:
 *                   type: string
 *                   example: "Open Emoji API is connected and working"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/status", protectRoute, async (req, res) => {
  const apiKey = process.env.VITE_EMOJI_API_KEY;
  
  if (!apiKey) {
    return res.json({
      status: "not_configured",
      apiKey: false,
      lastChecked: new Date().toISOString(),
      message: "No API key configured. Add VITE_EMOJI_API_KEY to environment variables."
    });
  }

  try {
    // Test API connectivity
    const response = await fetch(`https://emoji-api.com/emojis?access_key=${apiKey}&limit=1`);
    
    if (response.ok) {
      res.json({
        status: "connected",
        apiKey: true,
        lastChecked: new Date().toISOString(),
        message: "Open Emoji API is connected and working"
      });
    } else {
      res.json({
        status: "disconnected",
        apiKey: true,
        lastChecked: new Date().toISOString(),
        message: `API error: ${response.status} ${response.statusText}`
      });
    }
  } catch (error) {
    res.json({
      status: "disconnected",
      apiKey: true,
      lastChecked: new Date().toISOString(),
      message: `Connection error: ${error.message}`
    });
  }
});

export default router;
