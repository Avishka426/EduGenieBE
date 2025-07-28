const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔄 Testing MongoDB connection...');
        console.log('📍 URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB connected successfully!');
        console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
        
        // Test a simple operation
        const testDoc = await mongoose.connection.db.admin().ping();
        console.log('🏓 Ping successful:', testDoc);
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error type:', error.name);
        
        if (error.name === 'MongooseServerSelectionError') {
            console.log('\n🔧 Common solutions:');
            console.log('1. Check MongoDB Atlas cluster status');
            console.log('2. Verify network access (IP whitelist)');
            console.log('3. Check username/password in connection string');
            console.log('4. Ensure cluster is not paused');
            console.log('5. Check internet connection');
        }
    }
}

testConnection();
