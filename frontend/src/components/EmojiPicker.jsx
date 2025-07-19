import { useState, useEffect, useRef } from "react";
import { Smile, X, Search } from "lucide-react";
import { emojiService } from "../lib/emojiService";
import { EMOJI_CONFIG } from "../lib/emojiConfig";

const EmojiPicker = ({ onEmojiSelect, isOpen, onToggle }) => {
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(EMOJI_CONFIG.DEFAULT_CATEGORY);
  const pickerRef = useRef(null);
  const searchInputRef = useRef(null);

  const categories = emojiService.getCategories();

  // Fetch emojis based on category or search
  const fetchEmojis = async (category = selectedCategory, search = searchTerm) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (search.trim()) {
        result = await emojiService.searchEmojis(search);
      } else {
        result = await emojiService.getEmojisByCategory(category);
      }
      setEmojis(result.slice(0, EMOJI_CONFIG.EMOJIS_PER_PAGE));
    } catch (err) {
      console.error("Error fetching emojis:", err);
      if (err.message.includes("API key is required")) {
        setError("API key required. Please configure VITE_EMOJI_API_KEY in your .env file.");
      } else if (err.message.includes("API request failed")) {
        setError("Failed to load emojis. Please check your API key or try again later.");
      } else {
        setError("Failed to load emojis. Please try again.");
      }
      setEmojis([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch emojis when picker opens or category changes
  useEffect(() => {
    if (isOpen) {
      fetchEmojis();
      // Focus search input when picker opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, selectedCategory]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        fetchEmojis(selectedCategory, searchTerm);
      }, EMOJI_CONFIG.SEARCH_DEBOUNCE_MS);
      return () => clearTimeout(timeoutId);
    } else if (isOpen) {
      fetchEmojis(selectedCategory, "");
    }
  }, [searchTerm]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      
      if (event.key === "Escape") {
        onToggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji.character);
    onToggle(); // Close picker after selection
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm(""); // Clear search when changing category
  };

  const clearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 bg-base-100 border border-base-300 rounded-lg shadow-xl w-80 sm:w-80 max-w-[90vw] h-96 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-base-300 bg-base-50 rounded-t-lg">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Smile size={16} />
          Choose an emoji
        </h3>
        <button 
          onClick={onToggle}
          className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-base-300">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search emojis..."
            className="input input-bordered input-sm w-full pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      {!searchTerm && (
        <div className="flex p-2 border-b border-base-300 bg-base-50">
          <div className="flex gap-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`btn btn-sm btn-circle flex-shrink-0 ${
                  selectedCategory === category.id 
                    ? "btn-primary" 
                    : "btn-ghost hover:bg-base-200"
                }`}
                title={category.name}
              >
                {category.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : error ? (
          <div className="text-center text-sm py-8">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-error mb-2">{error}</div>
            {error.includes("API key") && (
              <div className="text-xs text-base-content/60">
                Get your free API key from{" "}
                <a 
                  href="https://emoji-api.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  emoji-api.com
                </a>
              </div>
            )}
          </div>
        ) : emojis.length === 0 ? (
          <div className="text-center text-sm text-base-content/60 py-8">
            <div className="text-2xl mb-2">🔍</div>
            No emojis found
            {searchTerm && (
              <div className="mt-2">
                <button 
                  onClick={clearSearch}
                  className="btn btn-ghost btn-xs"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji, index) => (
              <button
                key={`${emoji.character}-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                className="btn btn-ghost btn-sm p-1 h-10 text-xl hover:bg-primary/10 transition-all duration-150 rounded-lg"
                title={emoji.unicodeName || emoji.character}
              >
                {emoji.character}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with tip */}
      <div className="p-2 border-t border-base-300 text-xs text-base-content/60 text-center bg-base-50 rounded-b-lg">
        Press Esc to close
      </div>
    </div>
  );
};

export default EmojiPicker;
