/**
 * AI Recommendation API Test Suite
 * Tests all GPT endpoints with the new standardized response format
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'https://edugeniebe-production.up.railway.app';
const API_URL = `${BASE_URL}/api`;

// Test user data
const testUser = {
    email: `aitest_${Date.now()}@example.com`,
    password: 'password123',
    name: 'AI Test User',
    role: 'student'
};

let authToken = '';

console.log('🤖 AI Recommendation API Test Suite');
console.log('====================================');
console.log(`📍 Testing API at: ${API_URL}`);
console.log(`⏰ Test started at: ${new Date().toISOString()}\n`);

/**
 * Test 1: User Registration and Login
 */
async function setupTestUser() {
    try {
        console.log('📋 Step 1: Setting up test user...');
        
        // Register user
        const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('✅ User registered successfully');
        
        // Login to get token
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        
        authToken = loginResponse.data.token;
        console.log('✅ User logged in successfully');
        console.log(`🔑 Auth token: ${authToken.substring(0, 20)}...\n`);
        
        return true;
    } catch (error) {
        console.error('❌ Setup failed:', error.response?.data?.message || error.message);
        return false;
    }
}

/**
 * Test 2: Health Check Endpoint
 */
async function testHealthEndpoint() {
    try {
        console.log('🏥 Step 2: Testing Health Endpoint...');
        
        const response = await axios.get(`${API_URL}/gpt/health`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const data = response.data;
        
        // Verify response format
        if (data.success !== undefined) {
            console.log('✅ Response format: STANDARDIZED (has success field)');
        } else {
            console.log('❌ Response format: OLD (missing success field)');
        }
        
        console.log('📊 Health Response:');
        console.log(JSON.stringify(data, null, 2));
        
        return data.success;
    } catch (error) {
        console.error('❌ Health check failed:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Test 3: API Usage Statistics
 */
async function testUsageEndpoint() {
    try {
        console.log('📈 Step 3: Testing Usage Statistics...');
        
        const response = await axios.get(`${API_URL}/gpt/usage`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const data = response.data;
        
        console.log('📊 Usage Response:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success && data.data) {
            console.log('✅ Usage endpoint working with standardized format');
            return true;
        } else {
            console.log('❌ Usage endpoint not using standardized format');
            return false;
        }
    } catch (error) {
        console.error('❌ Usage check failed:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Test 4: Popular Courses
 */
async function testPopularCoursesEndpoint() {
    try {
        console.log('🔥 Step 4: Testing Popular Courses...');
        
        const response = await axios.get(`${API_URL}/gpt/popular`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const data = response.data;
        
        console.log('📊 Popular Courses Response:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success && data.data && Array.isArray(data.data.courses)) {
            console.log(`✅ Found ${data.data.courses.length} popular courses`);
            return true;
        } else {
            console.log('❌ Popular courses endpoint format issue');
            return false;
        }
    } catch (error) {
        console.error('❌ Popular courses failed:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Test 5: AI Recommendations (Main Feature)
 */
async function testAIRecommendations() {
    try {
        console.log('🤖 Step 5: Testing AI Recommendations...');
        
        const testPrompts = [
            "I want to learn web development from scratch",
            "Help me become a data scientist",
            "What courses should I take for mobile app development?",
            "I need cybersecurity training for beginners"
        ];
        
        let successCount = 0;
        
        for (let i = 0; i < testPrompts.length; i++) {
            const prompt = testPrompts[i];
            console.log(`\n📝 Testing prompt ${i + 1}: "${prompt}"`);
            
            try {
                const response = await axios.post(`${API_URL}/gpt/recommendations`, 
                    { prompt }, 
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                
                const data = response.data;
                
                if (data.success && data.data) {
                    console.log(`✅ Prompt ${i + 1}: SUCCESS`);
                    console.log(`📚 Recommendations: ${data.data.recommendations?.length || 0}`);
                    console.log(`🔤 AI Response: ${data.data.aiResponse?.substring(0, 100)}...`);
                    console.log(`📊 API calls used: ${data.data.metadata?.apiCallsUsed || 'unknown'}`);
                    successCount++;
                } else {
                    console.log(`❌ Prompt ${i + 1}: Wrong format`);
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.log(`❌ Prompt ${i + 1}: ERROR - ${error.response?.data?.error?.message || error.message}`);
            }
        }
        
        console.log(`\n📊 AI Recommendations Summary: ${successCount}/${testPrompts.length} successful`);
        return successCount > 0;
        
    } catch (error) {
        console.error('❌ AI recommendations test failed:', error.message);
        return false;
    }
}

/**
 * Test 6: Error Handling
 */
async function testErrorHandling() {
    try {
        console.log('\n🚨 Step 6: Testing Error Handling...');
        
        // Test with invalid prompt (too short)
        console.log('Testing short prompt...');
        try {
            await axios.post(`${API_URL}/gpt/recommendations`, 
                { prompt: "Hi" }, 
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            console.log('❌ Short prompt should have failed');
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.success === false && errorData?.error?.message) {
                console.log('✅ Short prompt properly rejected with standardized error format');
            } else {
                console.log('❌ Error format not standardized');
            }
        }
        
        // Test with invalid prompt (too long)
        console.log('Testing long prompt...');
        const longPrompt = "A".repeat(501);
        try {
            await axios.post(`${API_URL}/gpt/recommendations`, 
                { prompt: longPrompt }, 
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            console.log('❌ Long prompt should have failed');
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.success === false && errorData?.error?.message) {
                console.log('✅ Long prompt properly rejected with standardized error format');
            } else {
                console.log('❌ Error format not standardized');
            }
        }
        
        // Test without authentication
        console.log('Testing without authentication...');
        try {
            await axios.get(`${API_URL}/gpt/health`);
            console.log('❌ Request without auth should have failed');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Authentication properly enforced');
            } else {
                console.log('❌ Authentication not properly enforced');
            }
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error handling test failed:', error.message);
        return false;
    }
}

/**
 * Main Test Runner
 */
async function runAllTests() {
    const results = {
        setup: false,
        health: false,
        usage: false,
        popular: false,
        recommendations: false,
        errorHandling: false
    };
    
    try {
        // Run all tests
        results.setup = await setupTestUser();
        if (!results.setup) {
            console.log('❌ Cannot continue without user setup');
            return;
        }
        
        results.health = await testHealthEndpoint();
        results.usage = await testUsageEndpoint();
        results.popular = await testPopularCoursesEndpoint();
        results.recommendations = await testAIRecommendations();
        results.errorHandling = await testErrorHandling();
        
        // Print final results
        console.log('\n🏁 FINAL TEST RESULTS');
        console.log('=====================');
        console.log(`✅ User Setup: ${results.setup ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Health Check: ${results.health ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Usage Stats: ${results.usage ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Popular Courses: ${results.popular ? 'PASS' : 'FAIL'}`);
        console.log(`✅ AI Recommendations: ${results.recommendations ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Error Handling: ${results.errorHandling ? 'PASS' : 'FAIL'}`);
        
        const passCount = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        
        console.log(`\n📊 Overall Score: ${passCount}/${totalTests} tests passed`);
        
        if (passCount === totalTests) {
            console.log('🎉 ALL TESTS PASSED! API is ready for frontend integration.');
        } else {
            console.log('⚠️  Some tests failed. Please check the issues above.');
        }
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
    }
}

// Run the test suite
runAllTests();
