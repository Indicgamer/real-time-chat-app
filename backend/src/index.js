import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import { specs, swaggerUi } from "./config/swagger.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import emojiRoutes from "./routes/emoji.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({limit: "50mb"}));

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/emojis", emojiRoutes);

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Chat App API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    docExpansion: "none",
    filter: true,
    showRequestDuration: true,
  },
}));

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Chat App API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      messages: "/api/messages",
      emojis: "/api/emojis",
    },
    features: {
      authentication: "JWT with HTTP-only cookies",
      realtime: "Socket.IO WebSocket support",
      emojis: "Open Emoji API integration",
      fileUpload: "Cloudinary image storage",
      database: "MongoDB with Mongoose ODM"
    },
    externalServices: {
      emojiAPI: {
        url: "https://emoji-api.com/",
        description: "Enhanced emoji search and categorization"
      },
      cloudinary: {
        description: "Image upload and optimization"
      }
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



server.listen(PORT,"0.0.0.0", () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
