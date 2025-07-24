// Test script for EduGenie Backend API
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('🧪 Testing EduGenie Backend API...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health Check Response:', healthResponse.data);
        console.log();

        // Test 2: API Info
        console.log('2️⃣ Testing API Info...');
        const apiResponse = await axios.get(`${BASE_URL}/api`);
        console.log('✅ API Info Response:', apiResponse.data);
        console.log();

        // Test 3: Register User
        console.log('3️⃣ Testing User Registration...');
        const testUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'student'
        };

        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
            console.log('✅ Registration Response:', registerResponse.data);
            
            // Test 4: Login User
            console.log('\n4️⃣ Testing User Login...');
            const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            console.log('✅ Login Response:', loginResponse.data);
            
            // Test 5: Get Profile
            console.log('\n5️⃣ Testing Get Profile...');
            const token = loginResponse.data.token;
            const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Profile Response:', profileResponse.data);
            
        } catch (error) {
            if (error.response?.status === 409) {
                console.log('ℹ️ User already exists, testing login...');
                const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
                    email: testUser.email,
                    password: testUser.password
                });
                console.log('✅ Login Response:', loginResponse.data);
            } else {
                throw error;
            }
        }

        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error testing API:', error.response?.data || error.message);
    }
}

// Run tests
testAPI();
