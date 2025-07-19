# Emoji API Documentation

## Overview

The Chat App includes comprehensive emoji integration powered by the Open Emoji API with a well-designed fallback system. This documentation covers both the frontend emoji service and backend emoji endpoints.

## Architecture

```
Frontend (React)
├── EmojiPicker Component
├── EmojiService (API Client)
├── EmojiConfig (Configuration)
└── MessageInput Integration

Backend (Node.js/Express)
├── Emoji Routes (/api/emojis)
├── Swagger Documentation
└── Environment Configuration
```

## API Endpoints

### Backend Emoji Endpoints

All emoji endpoints require authentication via JWT cookie.

#### GET /api/emojis/config
Get emoji integration configuration and available categories.

**Response:**
```json
{
  "apiEnabled": true,
  "categories": [
    {
      "id": "smileys-emotion",
      "name": "Smileys",
      "icon": "😀"
    }
  ],
  "features": {
    "search": true,
    "categories": true,
    "fallback": false
  },
  "limits": {
    "perPage": 64,
    "searchDebounce": 300
  }
}
```

#### GET /api/emojis/status
Check emoji API connectivity and status.

**Response:**
```json
{
  "status": "connected",
  "apiKey": true,
  "lastChecked": "2025-07-17T23:30:00.000Z",
  "message": "Open Emoji API is connected and working"
}
```

**Status Values:**
- `connected`: API is working properly
- `disconnected`: API key valid but connection failed
- `not_configured`: No API key provided

### Frontend Emoji Service

The frontend emoji service handles all emoji operations and caching.

#### Methods

##### `getAllEmojis()`
Fetch all emojis from the API.

```javascript
const emojis = await emojiService.getAllEmojis();
// Returns: Array<{character: string, unicodeName: string, category: string}>
```

##### `searchEmojis(query)`
Search emojis by name or keyword.

```javascript
const results = await emojiService.searchEmojis("happy");
// Returns: Array<Emoji>
```

##### `getEmojisByCategory(category)`
Get emojis filtered by category.

```javascript
const smileys = await emojiService.getEmojisByCategory("smileys-emotion");
// Returns: Array<Emoji>
```

##### `getCategories()`
Get available emoji categories.

```javascript
const categories = emojiService.getCategories();
// Returns: Array<{id: string, name: string, icon: string}>
```

##### `setApiKey(apiKey)`
Set or update the API key.

```javascript
emojiService.setApiKey("your_api_key_here");
```

## Open Emoji API Integration

### API Specification

**Base URL:** `https://emoji-api.com/emojis`

#### Get All Emojis
```
GET https://emoji-api.com/emojis?access_key={API_KEY}
```

#### Search Emojis
```
GET https://emoji-api.com/emojis?access_key={API_KEY}&search={QUERY}
```

#### Category Filter
```
GET https://emoji-api.com/emojis?access_key={API_KEY}&group={CATEGORY}
```

### Response Format

```json
[
  {
    "slug": "grinning-face",
    "character": "😀",
    "unicodeName": "grinning face",
    "codePoint": "1F600",
    "group": "smileys-emotion",
    "subGroup": "face-smiling"
  }
]
```

## Configuration

### Environment Variables

**Frontend (.env):**
```env
# Primary (Vite)
VITE_EMOJI_API_KEY=your_api_key_here

# Fallback (Create React App compatibility)
REACT_APP_EMOJI_API_KEY=your_api_key_here
```

**Backend (.env):**
```env
# For status checking
VITE_EMOJI_API_KEY=your_api_key_here
```

### Configuration Options

**Frontend Config (`src/lib/emojiConfig.js`):**
```javascript
export const EMOJI_CONFIG = {
  API_KEY: getApiKey(),
  API_BASE_URL: "https://emoji-api.com/emojis",
  EMOJIS_PER_PAGE: 64,
  SEARCH_DEBOUNCE_MS: 300,
  DEFAULT_CATEGORY: "smileys-emotion",
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
};
```

## Usage Examples

### Basic Emoji Picker Integration

```jsx
import EmojiPicker from './components/EmojiPicker';

function MessageInput() {
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => setShowPicker(!showPicker)}>😀</button>
      
      <EmojiPicker
        isOpen={showPicker}
        onToggle={() => setShowPicker(!showPicker)}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
}
```

### Custom Emoji Search

```javascript
// Search for heart emojis
const heartEmojis = await emojiService.searchEmojis("heart");

// Get all food emojis
const foodEmojis = await emojiService.getEmojisByCategory("food-drink");

// Get emoji configuration
const config = await fetch('/api/emojis/config').then(r => r.json());
```

## Error Handling

### Frontend Error Types

```javascript
try {
  const emojis = await emojiService.getAllEmojis();
} catch (error) {
  if (error.message.includes("API key is required")) {
    // Handle missing API key
    console.error("Please configure VITE_EMOJI_API_KEY");
  } else if (error.message.includes("API request failed")) {
    // Handle API errors
    console.error("Emoji API is currently unavailable");
  } else {
    // Handle other errors
    console.error("Unexpected emoji service error:", error);
  }
}
```

### Backend Error Responses

```json
{
  "error": "Unauthorized",
  "message": "Valid JWT token required"
}
```

## Categories

### Available Categories

| Category ID | Name | Description | Icon |
|-------------|------|-------------|------|
| `smileys-emotion` | Smileys | Faces and emotions | 😀 |
| `people-body` | People | People and body parts | 👋 |
| `animals-nature` | Nature | Animals and nature | 🐶 |
| `food-drink` | Food | Food and beverages | 🍎 |
| `travel-places` | Travel | Travel and places | 🚗 |
| `activities` | Activities | Sports and activities | ⚽ |
| `objects` | Objects | Objects and tools | 📱 |
| `symbols` | Symbols | Symbols and signs | ❤️ |
| `flags` | Flags | Country and regional flags | 🏳️ |

## Performance Considerations

### Caching Strategy

1. **In-Memory Cache**: Results cached for 5 minutes
2. **Request Debouncing**: Search requests debounced by 300ms
3. **Pagination**: Limited to 64 emojis per request
4. **Category Caching**: Categories cached separately

### Optimization Tips

1. **API Key Management**: Store securely in environment variables
2. **Rate Limiting**: Be mindful of API rate limits
3. **Error Fallbacks**: Always handle API failures gracefully
4. **Lazy Loading**: Load emojis only when picker is opened

## Swagger/OpenAPI Documentation

The complete API documentation is available at:
- **Development**: http://localhost:5001/api-docs
- **Production**: https://your-domain.com/api-docs

### Swagger Schema

The API includes comprehensive OpenAPI 3.0 schemas for:
- Emoji objects
- Category definitions
- Error responses
- Authentication requirements

## Testing

### Manual Testing

1. **Frontend**: Open emoji picker and verify emojis load
2. **Backend**: Visit `/api/emojis/status` to check connectivity
3. **API**: Test search and category filtering

### Automated Testing

```javascript
// Example test
describe('Emoji Service', () => {
  test('should fetch emojis with valid API key', async () => {
    emojiService.setApiKey('valid_key');
    const emojis = await emojiService.getAllEmojis();
    expect(Array.isArray(emojis)).toBe(true);
  });

  test('should throw error without API key', async () => {
    emojiService.setApiKey(null);
    await expect(emojiService.getAllEmojis()).rejects.toThrow('API key is required');
  });
});
```

## Troubleshooting

### Common Issues

1. **No Emojis Loading**
   - Check if `VITE_EMOJI_API_KEY` is set correctly
   - Verify API key validity at emoji-api.com
   - Check browser console for errors

2. **Search Not Working**
   - Ensure search query is not empty
   - Check network connectivity
   - Verify API rate limits not exceeded

3. **Categories Empty**
   - Check if API response includes `group` field
   - Verify category IDs match API documentation
   - Check for API response format changes

### Debug Mode

Enable debug logging:
```javascript
// In browser console
localStorage.setItem('emoji-debug', 'true');
```

### API Status Check

```bash
# Test API connectivity
curl "https://emoji-api.com/emojis?access_key=YOUR_KEY&limit=1"
```

## Getting Started

1. **Get API Key**: Sign up at https://emoji-api.com/
2. **Set Environment Variable**: Add `VITE_EMOJI_API_KEY=your_key` to `.env`
3. **Restart Development Server**: `npm run dev`
4. **Test Integration**: Open chat and click emoji button
5. **Verify Documentation**: Visit `/api-docs` for full API specs

## Support

- **Open Emoji API**: https://emoji-api.com/docs
- **Issues**: Report bugs in project repository
- **Documentation**: This file and `/api-docs` endpoint
