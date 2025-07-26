# 🚀 EduGenie Backend - Deployment Guide

## Quick Deploy

### Prerequisites
- Node.js 18+ 
- MongoDB database (Atlas recommended)
- OpenAI API key
- Cloudinary account

### Environment Setup
1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your credentials:
   ```bash
   # Database
   MONGODB_URI=your-mongodb-connection-string
   
   # Security
   JWT_SECRET=your-secret-key
   
   # APIs
   OPENAI_API_KEY=your-openai-key
   CLOUDINARY_URL=cloudinary://key:secret@cloud_name
   
   # Server
   PORT=3000
   NODE_ENV=production
   CLIENT_URL=your-frontend-domain
   ```

### Deploy to Heroku
```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongo-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set CLOUDINARY_URL=your-cloudinary-url
heroku config:set NODE_ENV=production
git push heroku main
```

### Deploy to Railway
```bash
# Connect your GitHub repo at railway.app
# Add environment variables in Railway dashboard
```

### Deploy to Render
```bash
# Connect your GitHub repo at render.com
# Add environment variables in Render dashboard
```

## API Endpoints
- **Auth**: `/api/auth/*`
- **Courses**: `/api/courses/*`
- **Profile**: `/api/profile/*`
- **GPT**: `/api/gpt/*`
- **Health**: `/health`

## Documentation
- API Documentation: `API.md`
- GPT Integration: `GPT_API_DOCS.md`
- Profile API: `PROFILE_API_DOCS.md`
- Environment Setup: `ENVIRONMENT_SETUP.md`

## Production Checklist
- ✅ Environment variables configured
- ✅ MongoDB connection tested
- ✅ Build process working (`npm run build`)
- ✅ JWT secret is secure (not default)
- ✅ CORS configured for your domain
- ✅ API keys are valid and have sufficient credits

## Support
For deployment issues, check the logs and ensure all environment variables are properly set.
