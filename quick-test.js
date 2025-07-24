// Simple test for EduGenie Backend API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function quickTest() {
    console.log('🧪 Quick Backend Test...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health:', healthResponse.data.message);

        // Test 2: API Info
        console.log('\n2️⃣ Testing API Info...');
        const apiResponse = await axios.get(`${BASE_URL}/api`);
        console.log('✅ API:', apiResponse.data.message);

        console.log('\n🎉 Basic tests passed! Server is running correctly.');
        console.log('\n📋 Available Endpoints:');
        console.log('• POST /api/auth/register - Register new user');
        console.log('• POST /api/auth/login - User login');
        console.log('• GET /api/auth/profile - Get user profile (auth required)');
        console.log('• GET /health - Health check');
        console.log('• GET /api - API documentation');

        console.log('\n🔧 To test authentication endpoints:');
        console.log('• Make sure MongoDB Atlas is accessible');
        console.log('• Use Postman or similar tool to test registration/login');
        console.log('• Or run the full test when database is connected');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

quickTest();
