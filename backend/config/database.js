import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 5000,
      connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS) || 5000,
    });

    console.log(`🐘 MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📡 MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Check database connection health
const healthCheck = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', database: mongoose.connection.name };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

export { connectDB, healthCheck };
export default connectDB;
