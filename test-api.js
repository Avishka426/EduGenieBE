// Test script to verify API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing EduGenie Backend API...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Health check:', healthResponse.data.message);
        console.log('📅 Server time:', healthResponse.data.timestamp);

        // Test API info endpoint
        console.log('\n2. Testing API info endpoint...');
        const apiResponse = await axios.get(`${API_BASE}`);
        console.log('✅ API Info:', apiResponse.data.message);

        // Test registration
        console.log('\n3. Testing user registration...');
        const registerData = {
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            name: 'Test User',
            role: 'student'
        };

        try {
            const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
            console.log('✅ Registration successful');
            console.log('👤 User:', registerResponse.data.user);
            console.log('🔑 Token received:', !!registerResponse.data.token);

            // Test login with the same credentials
            console.log('\n4. Testing user login...');
            const loginData = {
                email: registerData.email,
                password: registerData.password
            };

            const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
            console.log('✅ Login successful');
            console.log('👤 User:', loginResponse.data.user);
            console.log('🔑 Token received:', !!loginResponse.data.token);

            // Test protected route
            console.log('\n5. Testing protected route...');
            const token = loginResponse.data.token;
            const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Profile access successful');
            console.log('👤 Profile:', profileResponse.data.user);

        } catch (authError) {
            console.log('❌ Authentication test failed:', authError.response?.data?.message || authError.message);
            console.log('💡 This might be due to MongoDB connection issues');
        }

    } catch (error) {
        console.error('❌ API test failed:', error.response?.data || error.message);
    }
}

// Run the test
testAPI();
