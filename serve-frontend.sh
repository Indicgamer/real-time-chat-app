#!/bin/bash

# Simple script to serve frontend files with a basic HTTP server

PORT=${1:-3000}
FRONTEND_DIR="frontend/dist"

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend build not found. Please run 'npm run build' in the frontend directory first."
    exit 1
fi

echo "🌐 Starting frontend server on port $PORT..."
echo "📁 Serving files from: $FRONTEND_DIR"
echo "🔗 Access your app at: http://16.170.243.62:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"

# Try different HTTP server options
if command -v python3 &> /dev/null; then
    cd "$FRONTEND_DIR"
    python3 -m http.server $PORT --bind 0.0.0.0
elif command -v python &> /dev/null; then
    cd "$FRONTEND_DIR"
    python -m SimpleHTTPServer $PORT
elif command -v node &> /dev/null && npm list -g http-server &> /dev/null; then
    npx http-server "$FRONTEND_DIR" -p $PORT -a 0.0.0.0
else
    echo "❌ No suitable HTTP server found."
    echo "Please install one of the following:"
    echo "  - Python 3: sudo apt install python3"
    echo "  - Node.js http-server: npm install -g http-server"
    exit 1
fi
