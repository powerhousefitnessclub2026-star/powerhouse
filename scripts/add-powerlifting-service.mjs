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

const POWERLIFTING_SERVICE = {
  id: 'powerlifting',
  number: '07',
  title: 'Powerlifting',
  description: 'Expert-coached competitive powerlifting program covering Squat, Bench Press, and Deadlift. Train under a National Powerlifting Champion and compete at district, state, and national levels.',
  iconName: 'Dumbbell',
  highlights: [
    'Squat, Bench & Deadlift',
    'Competition Coaching',
    'National Champion Trainer',
    'Progressive Overload Plans'
  ]
};

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected successfully!');

    let data = await GymData.findOne({});
    if (!data) {
      console.log('No document found.');
      process.exit(1);
    }

    // Check if Powerlifting already exists
    const existing = (data.SERVICES || []).find(s => s.id === 'powerlifting');
    if (existing) {
      console.log('Powerlifting service already exists in DB. Updating it...');
      data.SERVICES = data.SERVICES.map(s =>
        s.id === 'powerlifting' ? POWERLIFTING_SERVICE : s
      );
    } else {
      console.log('Adding Powerlifting service to DB...');
      data.SERVICES = [...(data.SERVICES || []), POWERLIFTING_SERVICE];
    }

    data.markModified('SERVICES');
    await data.save();

    console.log('✅ Powerlifting service added successfully!');
    console.log('Current services:', data.SERVICES.map(s => `${s.number}. ${s.title}`).join(', '));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

run();
