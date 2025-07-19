#!/bin/bash

# Simple deployment script for your chat app

echo "🚀 Starting deployment process..."

# Stop any running processes
echo "📋 Stopping existing processes..."
pkill -f "node.*5001" || true

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend build completed!"

# Install/update backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed!"
    exit 1
fi

# Copy production environment file
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✅ Production environment loaded"
else
    echo "⚠️ No .env.production file found, using existing .env"
fi

# Start the backend server
echo "🚀 Starting backend server..."
NODE_ENV=production nohup node src/index.js > ../app.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../server.pid
echo "✅ Backend server started with PID: $SERVER_PID"

# Wait a moment for server to start
sleep 3

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server is running successfully!"
    echo "🌐 Your app should be accessible at:"
    echo "   Backend API: http://16.170.243.62:5001"
    echo "   Frontend: Serve the built files from frontend/dist"
    echo ""
    echo "📋 To stop the server later:"
    echo "   kill \$(cat server.pid)"
    echo ""
    echo "📋 To view logs:"
    echo "   tail -f app.log"
else
    echo "❌ Server failed to start! Check app.log for errors."
    exit 1
fi
