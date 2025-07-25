const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://192.168.43.66:3000/api'; // Updated to match your server
let authToken = '';

// Test user credentials (use your existing user)
const testUser = {
    email: 'i1@gmail.com',
    password: '123456' // Updated password
};

async function testProfileAPI() {
    console.log('🧪 Testing Profile Picture API...\n');

    try {
        // Step 1: Login to get token
        console.log('1️⃣ Login to get authentication token...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
        authToken = loginResponse.data.token;
        console.log('✅ Login successful');
        console.log('User:', loginResponse.data.user);
        console.log('Token:', authToken.substring(0, 20) + '...\n');

        // Step 2: Get current profile
        console.log('2️⃣ Get current profile...');
        const profileResponse = await axios.get(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Profile fetched successfully');
        console.log('Current profile picture:', profileResponse.data.user.profilePicture || 'None');
        console.log('User info:', {
            name: profileResponse.data.user.name,
            email: profileResponse.data.user.email,
            role: profileResponse.data.user.role
        });
        console.log();

        // Step 3: Test Cloudinary connection
        console.log('3️⃣ Testing Cloudinary connection...');
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
            cloudinary_url: 'cloudinary://416129499733948:rbOmFeGxx8z8d7Yxt8ARBHQFcm4@duocpqb1j'
        });
        
        // Test API connectivity
        const pingResult = await cloudinary.api.ping();
        console.log('✅ Cloudinary connection successful:', pingResult);
        console.log();

        // Step 4: Create a test image (if you don't have one)
        console.log('4️⃣ Creating test image...');
        const testImagePath = path.join(__dirname, 'test-profile.jpg');
        
        // Create a simple test image using a placeholder service
        if (!fs.existsSync(testImagePath)) {
            console.log('📸 Test image not found. You can:');
            console.log('   1. Add any image file as "test-profile.jpg" in the project root');
            console.log('   2. Or download from: https://via.placeholder.com/300x300.jpg');
            console.log('   3. Or use any existing image file\n');
            
            // Try to create a simple test image buffer
            const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
            fs.writeFileSync(testImagePath, testImageBuffer);
            console.log('✅ Created minimal test image');
        } else {
            console.log('✅ Test image found');
        }
        console.log();

        // Step 5: Test profile picture upload (if image exists)
        if (fs.existsSync(testImagePath)) {
            console.log('5️⃣ Testing profile picture upload...');
            
            const formData = new FormData();
            formData.append('profilePicture', fs.createReadStream(testImagePath));

            const uploadResponse = await axios.post(`${BASE_URL}/profile/picture`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    ...formData.getHeaders()
                }
            });
            
            console.log('✅ Profile picture uploaded successfully');
            console.log('New profile picture URL:', uploadResponse.data.user.profilePicture);
            console.log('Image details:', uploadResponse.data.imageDetails);
            console.log();
        }

        // Step 6: Update profile name
        console.log('6️⃣ Testing profile update...');
        const updateResponse = await axios.put(`${BASE_URL}/profile`, 
            { name: 'Updated Test Name' }, 
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('✅ Profile updated successfully');
        console.log('Updated name:', updateResponse.data.user.name);
        console.log();

        // Step 7: Final profile check
        console.log('7️⃣ Final profile check...');
        const finalProfileResponse = await axios.get(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Final profile state:');
        console.log(JSON.stringify(finalProfileResponse.data.user, null, 2));

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
    }
}

// Run the test
testProfileAPI();
