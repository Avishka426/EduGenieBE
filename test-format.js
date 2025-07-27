// Simple test to verify API response format
require('dotenv').config();

const test = async () => {
    try {
        const baseUrl = process.env.BACKEND_URL || 'https://edugeniebe-production.up.railway.app';
        
        // Create test user
        const testUser = {
            email: `formattest_${Date.now()}@example.com`,
            password: 'password123',
            name: 'Format Test User',
            role: 'student'
        };
        
        // Register user
        console.log('🔧 Creating test user...');
        const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        const registerData = await registerResponse.json();
        console.log('✅ User registered:', registerData.message);
        
        // Login to get token
        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: testUser.email, 
                password: testUser.password 
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginData.token) {
            console.log('❌ Failed to login');
            console.log('Login response:', JSON.stringify(loginData, null, 2));
            return;
        }
        
        console.log('✅ Login successful');
        
        // Test health endpoint with token
        const response = await fetch(`${baseUrl}/api/gpt/health`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });
        const data = await response.json();
        
        console.log('\nHealth endpoint response:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success !== undefined) {
            console.log('\n✅ New format detected - success field present');
        } else {
            console.log('\n❌ Old format detected - success field missing');
        }
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

test();
