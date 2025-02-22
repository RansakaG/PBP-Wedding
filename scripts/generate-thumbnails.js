import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THUMBNAIL_WIDTH = 1200; // Width for high-quality thumbnails
const ASSETS_DIR = path.join(__dirname, '../src/assets/wedding');

async function processImage(filePath) {
  try {
    const ext = path.extname(filePath);
    if (ext !== '.webp' || filePath.includes('-thumb')) return; // Skip thumbnail files

    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);
    const thumbnailPath = path.join(dir, `${basename}-thumb${ext}`);

    await sharp(filePath)
      .resize(THUMBNAIL_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
        kernel: 'lanczos3',
      })
      .webp({ 
        quality: 95, // Maximum quality
        lossless: false,
        effort: 6,
        smartSubsample: true,
        force: true // Ensure WebP output
      })
      .toFile(thumbnailPath);

    console.log(`Created thumbnail: ${thumbnailPath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function processAllImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processAllImages(fullPath);
    } else if (entry.isFile() && !entry.name.includes('-thumb')) {
      await processImage(fullPath);
    }
  }
}

// Run the script
(async () => {
  try {
    await processAllImages(ASSETS_DIR);
    console.log('All thumbnails generated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();