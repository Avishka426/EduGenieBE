const axios = require('axios');

const BASE_URL = 'https://edugeniebe-production.up.railway.app/api/auth';
// const BASE_URL = 'http://localhost:3000/api/auth'; // For local testing

async function testAPI() {
    console.log('🧪 Testing EduGenie Auth API...\n');

    try {
        // Test 1: Register User
        console.log('1️⃣ Testing Register...');
        const registerResponse = await axios.post(`${BASE_URL}/register`, {
            email: `test${Date.now()}@example.com`, // Unique email
            password: 'password123',
            name: 'Test User',
            role: 'student'
        });
        
        console.log('✅ Register Success:', registerResponse.status);
        console.log('📝 Response:', registerResponse.data);
        
        const token = registerResponse.data.token;
        const userEmail = registerResponse.data.user.email;
        
        console.log('\n2️⃣ Testing Login...');
        // Test 2: Login User
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: userEmail,
            password: 'password123'
        });
        
        console.log('✅ Login Success:', loginResponse.status);
        console.log('📝 Response:', loginResponse.data);
        
        console.log('\n3️⃣ Testing Get Profile...');
        // Test 3: Get Profile
        const profileResponse = await axios.get(`${BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Profile Success:', profileResponse.status);
        console.log('📝 Response:', profileResponse.data);
        
        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Run the tests
testAPI();
