# 🔐 Environment Setup Guide

## Important Security Note
**Never commit API keys or sensitive credentials to your repository!**

## Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Update Your `.env` File
Replace the placeholder values in your `.env` file with your actual credentials:

```bash
# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:8081

# Cloudinary Configuration (for profile picture uploads)
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloud-name

# OpenAI Configuration (for GPT-powered course recommendations)
OPENAI_API_KEY=your-actual-openai-api-key-here
```

### 3. Get Your API Keys

#### OpenAI API Key:
1. Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

#### Cloudinary Configuration:
1. Visit [Cloudinary Console](https://cloudinary.com/console)
2. Sign in to your account
3. Copy your Cloud Name, API Key, and API Secret
4. Format as: `cloudinary://api_key:api_secret@cloud_name`

#### MongoDB URI:
- **Local MongoDB**: `mongodb://localhost:27017/edugenie`
- **MongoDB Atlas**: Get connection string from your Atlas cluster

### 4. Verify Setup
Run the environment check script:
```bash
node check-env.js
```

## 🚨 Security Reminders
- The `.env` file is in `.gitignore` and should NEVER be committed
- Use `.env.example` as a template with placeholder values
- Rotate API keys regularly
- Use environment-specific variables for production

## 🔧 Troubleshooting
- If GitHub blocks your push due to secrets, remove the actual keys from any committed files
- Always use placeholder values in documentation and example files
- Check that `.env` is properly listed in `.gitignore`
