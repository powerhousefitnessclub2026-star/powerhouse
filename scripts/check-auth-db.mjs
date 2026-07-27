import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akalyakrish14_db_user:3aw7JhlbTPtJWkEl@cluster0.96nafcz.mongodb.net/powerhouse?retryWrites=true&w=majority';

const GymDataSchema = new mongoose.Schema({
  ADMIN_CREDENTIALS: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

const GymData = mongoose.models.GymData || mongoose.model('GymData', GymDataSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected!');

    const data = await GymData.findOne({});
    console.log('=== CURRENT DB ADMIN CREDENTIALS ===');
    console.log(data?.ADMIN_CREDENTIALS);
  } catch (error) {
    console.error('Error reading DB:', error);
  } finally {
    await mongoose.connection.close();
  }
}

run();
