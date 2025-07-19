// Configuration for emoji integration
// You can get a free API key from https://emoji-api.com/
// If no API key is provided, the app will use a fallback emoji collection

// Get API key from environment variables (works with both Vite and Create React App)
const getApiKey = () => {
  // Try Vite style first
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_EMOJI_API_KEY || import.meta.env.REACT_APP_EMOJI_API_KEY;
  }
  // Fallback to process.env for Create React App
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_EMOJI_API_KEY;
  }
  return null;
};

export const EMOJI_CONFIG = {
  // Set your Open Emoji API key here (optional)
  // Get it from: https://emoji-api.com/
  API_KEY: getApiKey(),
  
  // API configuration
  API_BASE_URL: "https://emoji-api.com/emojis",
  
  // Emoji picker settings
  EMOJIS_PER_PAGE: 64,
  SEARCH_DEBOUNCE_MS: 300,
  
  // Default settings
  DEFAULT_CATEGORY: "smileys-emotion",
  
  // Cache settings
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
};

// Initialize emoji service with config
import { emojiService } from "./emojiService";

// Initialize function to be called when needed
export const initializeEmojiService = () => {
  if (EMOJI_CONFIG.API_KEY) {
    emojiService.setApiKey(EMOJI_CONFIG.API_KEY);
    console.log("🎉 Open Emoji API key configured! Full emoji collection available.");
  } else {
    console.error("⚠️ No API key found. Please set VITE_EMOJI_API_KEY in your .env file to use emojis.");
    console.log("💡 Get your free API key from: https://emoji-api.com/");
  }
};

// Auto-initialize
initializeEmojiService();
