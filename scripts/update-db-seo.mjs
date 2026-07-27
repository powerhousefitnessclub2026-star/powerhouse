import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akalyakrish14_db_user:3aw7JhlbTPtJWkEl@cluster0.96nafcz.mongodb.net/powerhouse?retryWrites=true&w=majority';

const GymDataSchema = new mongoose.Schema({
  GYM_INFO: { type: mongoose.Schema.Types.Mixed, default: {} },
  SERVICES: { type: [mongoose.Schema.Types.Mixed], default: [] },
  MEMBERSHIP_PLANS: { type: [mongoose.Schema.Types.Mixed], default: [] },
  TRAINERS: { type: [mongoose.Schema.Types.Mixed], default: [] },
  GALLERY_ITEMS: { type: [mongoose.Schema.Types.Mixed], default: [] },
  REVIEWS: { type: [mongoose.Schema.Types.Mixed], default: [] },
  HERO: { type: mongoose.Schema.Types.Mixed, default: {} },
  CONTACT_OPTIONS: { type: mongoose.Schema.Types.Mixed, default: {} },
  ADMIN_CREDENTIALS: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const GymData = mongoose.models.GymData || mongoose.model('GymData', GymDataSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected successfully!');

    let data = await GymData.findOne({});
    if (!data) {
      console.log('No document found to update.');
      process.exit(0);
    }

    console.log('Updating GYM_INFO with local Erode SEO details...');
    data.GYM_INFO = {
      ...data.GYM_INFO,
      tagline: 'Best Unisex Gym in Erode, Tamil Nadu',
      address: 'Chelliyamman Temple Opp, Manikkampalayam Main Road, Soolai, Erode - 638 004',
      phone: '+91 73739 96262 / +91 93423 03823',
      email: 'powerhousefitnessclub2026@gmail.com'
    };

    // Mark as modified if Mongoose Mixed type doesn't auto-detect
    data.markModified('GYM_INFO');
    await data.save();

    console.log('Database successfully updated!');
  } catch (error) {
    console.error('Error running script:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

run();
