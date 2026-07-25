import mongoose from 'mongoose';

// Fallback to hardcoded URI for now to ensure it works without ENV setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akalyakrish14_db_user:3aw7JhlbTPtJWkEl@cluster0.96nafcz.mongodb.net/powerhouse?retryWrites=true&w=majority';

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
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
