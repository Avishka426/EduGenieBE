// MongoDB Connection Test
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('🧪 Testing MongoDB Atlas Connection...\n');
        
        const mongoURI = process.env.MONGODB_URI;
        console.log('URI:', mongoURI);
        
        // Test with minimal options
        console.log('Attempting to connect...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('Connection details:');
        console.log('- Host:', mongoose.connection.host);
        console.log('- Database:', mongoose.connection.name);
        console.log('- Ready State:', mongoose.connection.readyState);
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('- Collections:', collections.length);
        
        await mongoose.disconnect();
        console.log('✅ Disconnected successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        
        if (error.code === 'ENOTFOUND') {
            console.log('\n💡 DNS Resolution Issue - Possible Solutions:');
            console.log('1. Check your internet connection');
            console.log('2. Try using Google DNS (8.8.8.8, 8.8.4.4)');
            console.log('3. Verify the MongoDB Atlas cluster is running');
            console.log('4. Check if your IP is whitelisted in MongoDB Atlas');
        }
    }
};

testConnection();
