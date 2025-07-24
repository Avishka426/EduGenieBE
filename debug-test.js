const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data with all required fields
const testCourseData = {
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language',
    content: 'Module 1: Variables and Data Types\nModule 2: Functions\nModule 3: Objects and Arrays',
    category: 'Programming',
    duration: 20,
    level: 'Beginner',
    price: 49.99,
    thumbnail: 'https://example.com/js-thumb.jpg',
    tags: ['javascript', 'programming', 'beginner'],
    maxStudents: 50
};

async function quickTest() {
    console.log('🔍 Quick API Test - Debugging Course Creation\n');

    try {
        // 1. Test health endpoint
        console.log('1️⃣ Testing server health...');
        const healthResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Server is running:', healthResponse.data.message);
        console.log('');

        // 2. Test course categories (should work without auth)
        console.log('2️⃣ Testing course categories...');
        const categoriesResponse = await axios.get(`${BASE_URL}/courses/categories`);
        console.log('✅ Categories retrieved:', categoriesResponse.data.categories.length, 'categories');
        console.log('📋 Available categories:', categoriesResponse.data.categories.map(c => c.name).join(', '));
        console.log('');

        // 3. Test register/login instructor
        console.log('3️⃣ Testing instructor registration and login...');
        
        // Register instructor
        try {
            await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test Instructor',
                email: 'instructor@test.com',
                password: 'password123',
                role: 'instructor'
            });
            console.log('✅ Instructor registered successfully');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('ℹ️  Instructor already exists, proceeding with login');
            } else {
                throw error;
            }
        }

        // Login instructor
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'instructor@test.com',
            password: 'password123'
        });
        
        const instructorToken = loginResponse.data.token;
        console.log('✅ Instructor logged in successfully');
        console.log('🔑 Token received:', instructorToken ? 'Yes' : 'No');
        console.log('');

        // 4. Test course creation with detailed logging
        console.log('4️⃣ Testing course creation...');
        console.log('📝 Sending course data:');
        console.log(JSON.stringify(testCourseData, null, 2));
        console.log('');

        try {
            const createResponse = await axios.post(`${BASE_URL}/courses`, testCourseData, {
                headers: { 
                    'Authorization': `Bearer ${instructorToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Course created successfully!');
            console.log('📚 Course details:', createResponse.data.course);
        } catch (error) {
            console.log('❌ Course creation failed');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data);
            
            // Log what fields might be missing
            const requiredFields = ['title', 'description', 'content', 'category', 'duration', 'level', 'price'];
            console.log('\n🔍 Checking required fields:');
            requiredFields.forEach(field => {
                const value = testCourseData[field];
                console.log(`  ${field}: ${value !== undefined ? '✅' : '❌'} (${value})`);
            });
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Server might not be running. Please start it with: npm run dev');
        }
    }
}

quickTest();
