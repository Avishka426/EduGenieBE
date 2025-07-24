import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');
        console.log('URI (masked):', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

        // Set mongoose options to avoid deprecation warnings
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);

        // Connect with basic options for Mongoose 5.x
        await mongoose.connect(mongoURI);
        
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🔐 Connection state: ${mongoose.connection.readyState}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.log('⚠️  Server will continue running without database connection');
        console.log('⚠️  Database-dependent features will not work until connection is restored');
        // Don't exit the process, let the server run without DB
    }
};
