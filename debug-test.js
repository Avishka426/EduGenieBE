// Debug script to find users
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema (simplified)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});

const User = mongoose.model('User', userSchema);

const findUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const users = await User.find({}).limit(5);
        console.log(`Found ${users.length} users:`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
        });
        
        // Test login with first user
        if (users.length > 0) {
            const testUser = users[0];
            console.log(`\nTesting login with: ${testUser.email}`);
            
            // Try common passwords
            const testPasswords = ['password123', 'test123', '123456', 'password'];
            
            for (const password of testPasswords) {
                try {
                    const isValid = await bcrypt.compare(password, testUser.password);
                    if (isValid) {
                        console.log(`✅ Valid password found: ${password}`);
                        break;
                    }
                } catch (err) {
                    console.log(`❌ Error testing password ${password}`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

findUsers();
