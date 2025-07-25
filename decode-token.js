const jwt = require('jsonwebtoken');

// Your JWT token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgyMmNiNDEyYjA4YjJjNTg3YTQ2ZjEiLCJlbWFpbCI6ImkxQGdtYWlsLmNvbSIsInJvbGUiOiJpbnN0cnVjdG9yIiwiaWF0IjoxNzUzNDI0Njk1LCJleHAiOjE3NTQwMjk0OTV9.XbRNDpt5MSO8XfUEqHuQU2Z2B3AKZiaohWMkMzhsCx4";

try {
    const decoded = jwt.decode(token);
    console.log('JWT Token Contents:');
    console.log(JSON.stringify(decoded, null, 2));
    
    console.log('\n🔍 Key Information:');
    console.log('User ID in token:', decoded.userId);
    console.log('Course instructor ID: 68822cb412b08b2c587a46f1');
    console.log('Do they match?', decoded.userId === '68822cb412b08b2c587a46f1');
    
} catch (error) {
    console.error('Token decode error:', error.message);
}
