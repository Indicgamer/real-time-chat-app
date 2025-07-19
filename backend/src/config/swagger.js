import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fullstack Chat App API',
      version: '1.0.0',
      description: `
A comprehensive API for a real-time chat application with authentication, messaging, emoji integration, and file upload capabilities.

## Features
- 🔐 JWT-based authentication with HTTP-only cookies
- 💬 Real-time messaging with Socket.IO
- 😀 Emoji integration with Open Emoji API
- 🖼️ Image upload via Cloudinary
- 👥 User management and profiles
- 📡 WebSocket support for live updates

## Getting Started
1. Authenticate using /auth/login or /auth/signup
2. Use /messages endpoints for chat functionality  
3. Configure emoji API key for enhanced emoji support
4. Real-time features work automatically via WebSocket

## External Integrations
- **Open Emoji API**: Enhanced emoji search and categorization
- **Cloudinary**: Image storage and optimization
- **MongoDB**: Data persistence
- **Socket.IO**: Real-time communication
      `,
      contact: {
        name: 'API Support',
        email: 'support@chatapp.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com/api' : 'http://localhost:5001/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
          description: 'JWT token stored in HTTP-only cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'fullName', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User unique identifier',
              example: '60d0fe4f5311236168a109ca',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com',
            },
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            profilePic: {
              type: 'string',
              description: 'URL to user profile picture',
              example: 'https://res.cloudinary.com/demo/image/upload/profile.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Message: {
          type: 'object',
          required: ['senderId', 'receiverId'],
          properties: {
            _id: {
              type: 'string',
              description: 'Message unique identifier',
              example: '60d0fe4f5311236168a109cb',
            },
            senderId: {
              type: 'string',
              description: 'ID of the message sender',
              example: '60d0fe4f5311236168a109ca',
            },
            receiverId: {
              type: 'string',
              description: 'ID of the message receiver',
              example: '60d0fe4f5311236168a109cd',
            },
            text: {
              type: 'string',
              description: 'Message text content',
              example: 'Hello, how are you?',
            },
            image: {
              type: 'string',
              description: 'URL to attached image',
              example: 'https://res.cloudinary.com/demo/image/upload/message.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Message creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Message last update timestamp',
            },
          },
        },
        AuthRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'password123',
            },
          },
        },
        SignupRequest: {
          allOf: [
            { $ref: '#/components/schemas/AuthRequest' },
            {
              type: 'object',
              required: ['fullName'],
              properties: {
                fullName: {
                  type: 'string',
                  description: 'User full name',
                  example: 'John Doe',
                },
              },
            },
          ],
        },
        MessageRequest: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Message text content',
              example: 'Hello, how are you?',
            },
            image: {
              type: 'string',
              description: 'Base64 encoded image data',
              example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            profilePic: {
              type: 'string',
              description: 'Base64 encoded profile picture data',
              example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Something went wrong',
            },
            error: {
              type: 'string',
              description: 'Detailed error information',
              example: 'Internal server error',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
  ],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
