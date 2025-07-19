// Emoji service to handle fetching and categorizing emojis
class EmojiService {
  constructor() {
    this.apiKey = null;
    this.baseUrl = "https://emoji-api.com/emojis";
    this.cache = new Map();
  }

  // Get all emojis from API only
  async getAllEmojis() {
    const cacheKey = "all_emojis";
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.apiKey) {
      throw new Error("API key is required. Please set your Open Emoji API key.");
    }

    try {
      const response = await fetch(`${this.baseUrl}?access_key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formatted = data.map(emoji => ({
          character: emoji.character,
          unicodeName: emoji.unicodeName || emoji.slug || emoji.character,
          category: emoji.group || 'misc'
        }));
        this.cache.set(cacheKey, formatted);
        return formatted;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Failed to fetch emojis from API:", error);
      throw error;
    }
  }

  // Search emojis
  async searchEmojis(query) {
    const cacheKey = `search_${query}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.apiKey) {
      throw new Error("API key is required. Please set your Open Emoji API key.");
    }

    if (!query || !query.trim()) {
      return await this.getAllEmojis();
    }

    try {
      const response = await fetch(`${this.baseUrl}?access_key=${this.apiKey}&search=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`API search failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formatted = data.map(emoji => ({
          character: emoji.character,
          unicodeName: emoji.unicodeName || emoji.slug || emoji.character,
          category: emoji.group || 'misc'
        }));
        this.cache.set(cacheKey, formatted);
        return formatted;
      } else {
        throw new Error("Invalid search response format");
      }
    } catch (error) {
      console.error("Failed to search emojis via API:", error);
      throw error;
    }
  }

  // Get emojis by category
  async getEmojisByCategory(category) {
    const cacheKey = `category_${category}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const allEmojis = await this.getAllEmojis();
      const filtered = allEmojis.filter(emoji => 
        emoji.category.toLowerCase() === category.toLowerCase()
      );
      this.cache.set(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.error(`Failed to get emojis for category ${category}:`, error);
      throw error;
    }
  }

  // Get available categories (based on typical Open Emoji API categories)
  getCategories() {
    return [
      { id: 'smileys-emotion', name: 'Smileys', icon: '😀' },
      { id: 'people-body', name: 'People', icon: '�' },
      { id: 'animals-nature', name: 'Nature', icon: '🐶' },
      { id: 'food-drink', name: 'Food', icon: '�' },
      { id: 'travel-places', name: 'Travel', icon: '🚗' },
      { id: 'activities', name: 'Activities', icon: '⚽' },
      { id: 'objects', name: 'Objects', icon: '📱' },
      { id: 'symbols', name: 'Symbols', icon: '❤️' },
      { id: 'flags', name: 'Flags', icon: '🏳️' }
    ];
  }

  // Set API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.cache.clear(); // Clear cache when API key changes
  }
}

export const emojiService = new EmojiService();
