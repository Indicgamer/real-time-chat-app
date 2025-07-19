# Quick Deployment Guide

## Your Current Configuration
- **Backend URL**: http://16.170.243.62:5001
- **Frontend URL**: Will be served on port 3000
- **Database**: MongoDB Atlas (already configured)

## Deployment Steps

### 1. Make scripts executable
```bash
chmod +x deploy-simple.sh
chmod +x serve-frontend.sh
```

### 2. Deploy the application
```bash
# This will build frontend and start backend
./deploy-simple.sh
```

### 3. Serve the frontend (in a new terminal)
```bash
# Serve frontend on port 3000 (default)
./serve-frontend.sh

# Or specify a different port
./serve-frontend.sh 8080
```

## What the deployment does:

### Backend Changes Made:
1. Fixed CORS configuration to allow your server IP
2. Created production environment file
3. Backend will run on port 5001

### Frontend Changes Made:
1. Fixed API URL configuration (removed typo)
2. Updated axios to use environment variable
3. Created production environment file
4. Frontend will be built and served as static files

## Access Your Application:
- **API Documentation**: http://16.170.243.62:5001/api-docs
- **Backend API**: http://16.170.243.62:5001/api
- **Frontend**: http://16.170.243.62:3000 (when using serve-frontend.sh)

## Monitoring:
```bash
# View backend logs
tail -f app.log

# Check if backend is running
curl http://16.170.243.62:5001/api

# Stop backend
kill $(cat server.pid)
```

## Environment Variables:
Your environment is configured to work with:
- Backend API: `http://16.170.243.62:5001`
- MongoDB Atlas connection
- Cloudinary for image uploads
- Open Emoji API for enhanced emojis

## Troubleshooting:
If you encounter issues:
1. Check `app.log` for backend errors
2. Ensure MongoDB Atlas allows your server IP
3. Verify ports 5001 and 3000 are open on your server
4. Check CORS settings if frontend can't connect to backend
