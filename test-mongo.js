const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    console.log('🧪 Testing MongoDB Connection...\n');
    
    const mongoURI = process.env.MONGODB_URI;
    console.log('Connection String (masked):', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    try {
        console.log('Attempting connection...');
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin',
            dbName: 'edugenie',
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            connectTimeoutMS: 10000,
        });
        
        console.log('✅ Connection successful!');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);
        console.log('Ready state:', conn.connection.readyState);
        
        // Test a simple operation
        console.log('\n🧪 Testing database operation...');
        const testCollection = conn.connection.db.collection('test');
        await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
        console.log('✅ Database write test successful!');
        
        // Clean up test document
        await testCollection.deleteOne({ test: 'connection' });
        console.log('✅ Test cleanup successful!');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        
        if (error.code === 'ENOTFOUND') {
            console.log('\n💡 DNS resolution failed. Possible causes:');
            console.log('   - Internet connectivity issues');
            console.log('   - MongoDB Atlas cluster is paused');
            console.log('   - Firewall blocking connection');
            console.log('   - Incorrect cluster hostname');
        } else if (error.code === 8000) {
            console.log('\n💡 Authentication failed. Possible causes:');
            console.log('   - Incorrect username/password');
            console.log('   - User doesn\'t have access to the database');
            console.log('   - Wrong authentication database');
        }
    }
};

testConnection();
