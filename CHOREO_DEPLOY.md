# 🚀 EduGenie Backend - Choreo Deployment Guide

## 📋 Prerequisites
- GitHub repository with your code
- Choreo account at https://console.choreo.dev/
- All environment variables ready

## 🔧 Step-by-Step Deployment

### **1. Create New Component in Choreo**

1. **Login to Choreo Console**: https://console.choreo.dev/
2. **Create New Project** or use existing one
3. **Click "Create Component"**
4. **Select Component Type**: `Service`
5. **Select Runtime**: `NodeJS`

### **2. Connect GitHub Repository**

1. **Authorize GitHub** access if not already done
2. **Select Repository**: `Avishka426/EduGenieBE`
3. **Select Branch**: `main`
4. **Component Name**: `edugenie-backend`
5. **Component Description**: `EduGenie Backend API with AI-powered course recommendations`

### **3. Configure Build Settings**

**Build Configuration:**
```yaml
Project Directory: /
Build Command: npm install && npm run build
Start Command: npm start
Port: 8080
```

**Advanced Settings:**
- **Node.js Version**: `20.x`
- **Health Check Path**: `/health`
- **Environment**: `Production`

### **4. Set Environment Variables**

In Choreo Console → Your Component → Configs → Environment Variables:

```env
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/edugenie?retryWrites=true&w=majority&serverSelectionTimeoutMS=20000&socketTimeoutMS=45000

JWT_SECRET=your-super-secret-jwt-key-here

CLOUDINARY_URL=cloudinary://[api_key]:[api_secret]@[cloud_name]

OPENAI_API_KEY=sk-proj-[your-openai-api-key-here]

CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**⚠️ Note**: 
- Replace all placeholder values with your actual credentials
- PORT will be automatically set by Choreo to 8080
- Never commit real API keys to Git repositories

### **5. Deploy**

1. **Click "Deploy"** in Choreo console
2. **Monitor Build Logs** for any issues
3. **Wait for deployment** to complete
4. **Get your API URL** from Choreo dashboard

### **6. Test Deployment**

Your API will be available at:
```
https://[your-component-name]-[unique-id].choreoapis.dev
```

**Test endpoints:**
- `GET /health` - Health check
- `GET /api` - API documentation
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/gpt/recommendations` - AI recommendations

## 🔍 **API Endpoints for Frontend Integration**

### **Base URL Pattern:**
```
https://[component-name]-[hash].choreoapis.dev
```

### **Authentication Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`  
- `GET /api/auth/profile`

### **AI Recommendation Endpoints:**
- `POST /api/gpt/recommendations`
- `GET /api/gpt/popular`
- `GET /api/gpt/usage`
- `GET /api/gpt/health`

### **Course Management:**
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/:id`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`

### **Profile Management:**
- `POST /api/profile/upload-picture`
- `DELETE /api/profile/delete-picture`

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   - Check Node.js version compatibility
   - Verify all dependencies install correctly
   - Review build logs in Choreo console

2. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify MongoDB Atlas IP whitelist includes Choreo

3. **CORS Issues:**
   - Update CLIENT_URL to your frontend domain
   - Choreo domains are pre-configured

4. **Database Connection:**
   - Verify MongoDB Atlas cluster is active
   - Check network access settings
   - Test connection string locally

## 🔐 **Security Considerations**

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Update CLIENT_URL for production frontend
3. **JWT Secret**: Use strong, unique secret in production
4. **API Keys**: Rotate keys regularly
5. **Database**: Use strong passwords and IP restrictions

## 📊 **Monitoring**

- **Choreo Console**: Monitor deployment status, logs, and metrics
- **Health Endpoint**: `/health` for uptime monitoring
- **API Usage**: `/api/gpt/usage` for OpenAI usage tracking

## 🚀 **Next Steps**

1. Deploy backend to Choreo
2. Update frontend to use new Choreo API URL
3. Test all endpoints thoroughly
4. Monitor performance and logs
5. Set up alerts for any issues

---

**🎉 Your EduGenie Backend will be live on Choreo!**
