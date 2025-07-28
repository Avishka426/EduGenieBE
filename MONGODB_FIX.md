## 🔧 MongoDB Connection Timeout - Solutions

### 🚨 IMMEDIATE FIXES TO TRY:

## Option 1: MongoDB Atlas Quick Fixes

1. **Check Cluster Status:**
   - Go to https://cloud.mongodb.com/
   - Login to your account
   - Check if your cluster is ACTIVE (not paused)
   - If paused, click "Resume" 

2. **Network Access:**
   - Go to "Network Access" in Atlas
   - Click "Add IP Address"
   - Add: 0.0.0.0/0 (allows all IPs for development)
   - Save changes

3. **Database User:**
   - Go to "Database Access" in Atlas
   - Verify user "avishkavishmitha2" exists
   - Make sure it has "Read and write to any database" permission

## Option 2: Local MongoDB (Backup Solution)

If Atlas keeps failing, use local MongoDB:

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install with default settings

2. **Start MongoDB Service:**
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`

3. **Update .env file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/edugenie
   ```

## Option 3: Alternative Atlas Connection String

Try this connection string in your .env:

```
MONGODB_URI=mongodb+srv://avishkavishmitha2:JneKKRutAsbhUf68@cluster0.r6ttixx.mongodb.net/edugenie?retryWrites=true&w=majority&serverSelectionTimeoutMS=30000&connectTimeoutMS=30000&socketTimeoutMS=30000
```

## Option 4: Test Connection Script

Run this to test your connection:

```bash
node test-mongodb.js
```

## MOST LIKELY CAUSE:
Your MongoDB Atlas cluster is probably PAUSED or has network restrictions.

Check Atlas dashboard first - this fixes 90% of timeout issues!
