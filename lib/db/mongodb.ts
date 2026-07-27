import mongoose from 'mongoose';

const DEFAULT_SRV_URI = 'mongodb+srv://akalyakrish14_db_user:3aw7JhlbTPtJWkEl@cluster0.96nafcz.mongodb.net/powerhouse?retryWrites=true&w=majority';
const DIRECT_SHARD_URI = 'mongodb://akalyakrish14_db_user:3aw7JhlbTPtJWkEl@cluster0-shard-00-00.96nafcz.mongodb.net:27017,cluster0-shard-00-01.96nafcz.mongodb.net:27017,cluster0-shard-00-02.96nafcz.mongodb.net:27017/powerhouse?ssl=true&replicaSet=atlas-13pld8-shard-0&authSource=admin&retryWrites=true&w=majority';

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_SRV_URI;

let cached = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4, // Force IPv4 for Vercel + Atlas Free Tier compatibility
    };

    const cleanUri = MONGODB_URI.replace(/['"]/g, '').trim();

    cached.promise = mongoose.connect(cleanUri, opts).then((mongoose) => {
      console.log('Successfully connected to MongoDB');
      return mongoose;
    }).catch(async (err) => {
      console.warn('Primary MongoDB connection attempt failed, trying fallback URI...', err.message);
      return mongoose.connect(DIRECT_SHARD_URI, opts).then((m) => {
        console.log('Successfully connected to MongoDB via fallback URI');
        return m;
      });
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
