import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const TARGET_DIRS = [
  'assets/assets',
  'assets/assets/samplegym'
];

async function compressImage(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    // Only compress files larger than 400KB
    if (stats.size < 400 * 1024) {
      console.log(`Skipping ${path.basename(filePath)} (${(stats.size/1024).toFixed(0)}KB) - already optimized.`);
      return;
    }

    console.log(`Processing ${path.basename(filePath)} (Original size: ${originalSizeMB} MB)`);
    
    const image = await Jimp.read(filePath);
    
    // Resize if wider than 1920px
    if (image.bitmap.width > 1920) {
      console.log(`  Resizing from ${image.bitmap.width}px to 1920px width...`);
      image.resize({ w: 1920 });
    }
    
    // Get MIME type based on extension
    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    
    // Get optimized buffer with quality setting (75% for jpeg)
    const buffer = await image.getBuffer(mime, { quality: 75 });
    
    // Write back to the same file
    fs.writeFileSync(filePath, buffer);
    
    const newStats = fs.statSync(filePath);
    const newSizeKB = (newStats.size / 1024).toFixed(0);
    console.log(`  Done! New size: ${newSizeKB} KB`);
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error);
  }
}

async function run() {
  for (const dir of TARGET_DIRS) {
    const dirPath = path.resolve(dir);
    if (!fs.existsSync(dirPath)) continue;
    
    console.log(`Scanning directory: ${dir}`);
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const filePath = path.join(dirPath, file);
        await compressImage(filePath);
      }
    }
  }
  console.log('All images optimized successfully!');
}

run();
