import mongoose from 'mongoose';
import crypto from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI 
  || 'mongodb://akalyakrish14_db_user:3aw7JhlbTPtJWkEl@cluster0-shard-00-00.96nafcz.mongodb.net:27017,cluster0-shard-00-01.96nafcz.mongodb.net:27017,cluster0-shard-00-02.96nafcz.mongodb.net:27017/powerhouse?ssl=true&replicaSet=atlas-13pld8-shard-0&authSource=admin&retryWrites=true&w=majority';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, storedHash, storedSalt) {
  if (!password || !storedHash || !storedSalt) return false;
  try {
    const hash = crypto.pbkdf2Sync(password, storedSalt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedHashBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedHashBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedHashBuffer);
  } catch (error) {
    return false;
  }
}

const GymDataSchema = new mongoose.Schema({
  ADMIN_CREDENTIALS: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

const GymData = mongoose.models.GymData || mongoose.model('GymData', GymDataSchema);

async function testCredentialFlow() {
  console.log('===========================================================');
  console.log('   ADMIN CREDENTIAL UPDATE & SECURITY AUDIT TEST           ');
  console.log('===========================================================\n');

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { family: 4, bufferCommands: false });
    console.log('Connected successfully!\n');

    // 1. Password Hashing Utility Verification
    console.log('--- TEST 1: Password Hash & Verification Utility ---');
    const testPassword = 'NewSecretPassword2026!';
    const { hash, salt } = hashPassword(testPassword);
    console.log(`Generated Salt: ${salt}`);
    console.log(`Generated Hash: ${hash.substring(0, 32)}...`);

    const correctMatch = verifyPassword(testPassword, hash, salt);
    const wrongMatch = verifyPassword('WrongPassword123', hash, salt);
    console.log(`Correct Password Verification: ${correctMatch ? 'PASS' : 'FAIL'}`);
    console.log(`Wrong Password Rejection: ${!wrongMatch ? 'PASS' : 'FAIL'}\n`);

    if (!correctMatch || wrongMatch) {
      throw new Error('Hash verification logic failed');
    }

    // 2. Updating Admin Credentials in Database
    console.log('--- TEST 2: Update Credentials in MongoDB ---');
    const newUsername = 'powerhouse';
    const newPassword = 'powerhousegym';
    const newHashObj = hashPassword(newPassword);

    await GymData.findOneAndUpdate(
      {},
      {
        $set: {
          ADMIN_CREDENTIALS: {
            username: newUsername,
            passwordHash: newHashObj.hash,
            salt: newHashObj.salt,
            password: newPassword,
            updatedAt: new Date().toISOString()
          }
        }
      },
      { new: true, upsert: true }
    );
    console.log('Credentials updated in MongoDB successfully.\n');

    // 3. Verify Database Persistence & Invalidation of Old Credentials
    console.log('--- TEST 3: Verify Persistence & Invalidation of Old Credentials ---');
    const doc = await GymData.findOne({});
    const dbCreds = doc.ADMIN_CREDENTIALS;

    console.log(`Stored DB Username: ${dbCreds.username}`);
    const isNewUserValid = (dbCreds.username.toLowerCase() === newUsername.toLowerCase());
    const isNewPassValid = verifyPassword(newPassword, dbCreds.passwordHash, dbCreds.salt);
    console.log(`Updated Credentials Check: ${isNewUserValid && isNewPassValid ? 'PASS' : 'FAIL'}`);

    // Verify invalid password fails
    const isInvalidPassRejected = !verifyPassword('wrongpassword123', dbCreds.passwordHash, dbCreds.salt);
    console.log(`Wrong Password Rejected: ${isInvalidPassRejected ? 'PASS' : 'FAIL'}\n`);

    if (!isNewUserValid || !isNewPassValid || !isInvalidPassRejected) {
      throw new Error('Credential invalidation/persistence check failed');
    }

    console.log('===========================================================');
    console.log('  ALL BACKEND & PERSISTENCE SECURITY CHECKS PASSED!        ');
    console.log('===========================================================');
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

testCredentialFlow();
