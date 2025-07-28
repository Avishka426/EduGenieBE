import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('🔄 Attempting to connect to MongoDB...');
        console.log('📍 URI (masked):', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

        // Enhanced connection options for better reliability
        const options = {
            serverSelectionTimeoutMS: 20000, // 20 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionRetryDelayMS: 5000, // Retry delay
            heartbeatFrequencyMS: 10000, // Heartbeat frequency
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
            retryWrites: true,
            retryReads: true,
        };

        // Connect with enhanced options
        await mongoose.connect(mongoURI, options);
        
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🔐 Connection state: ${mongoose.connection.readyState}`);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('🔗 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('🔌 MongoDB connection closed gracefully');
                process.exit(0);
            } catch (error) {
                console.error('Error closing MongoDB connection:', error);
                process.exit(1);
            }
        });

    } catch (error: any) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        console.error('Error type:', error.name);
        
        if (error.name === 'MongooseServerSelectionError') {
            console.log('\n🔧 MongoDB Atlas troubleshooting:');
            console.log('1. Check if cluster is active (not paused) at https://cloud.mongodb.com');
            console.log('2. Verify Network Access - add 0.0.0.0/0 for development');
            console.log('3. Check Database User permissions');
            console.log('4. Verify internet connection');
            console.log('5. Check if MongoDB Atlas is experiencing outages');
        }
        
        console.log('⚠️  Server will continue running without database connection');
        console.log('⚠️  Database-dependent features will not work until connection is restored');
        console.log('🔄 You can restart the server to retry connection\n');
        
        // Don't exit the process, let the server run without DB
        // This prevents crashes but API calls will fail gracefully
    }
};
