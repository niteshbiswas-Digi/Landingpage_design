import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const framesDir = path.join(process.cwd(), 'frames_temp');
const targetDir = path.join(process.cwd(), 'public', 'sequence');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  const allFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Found ${allFiles.length} files. Selecting 120 frames...`);

  // We want to pick exactly 120 frames
  const selectedFiles = allFiles.filter((_, i) => i % 2 === 0).slice(0, 120);
  
  if (selectedFiles.length === 0) {
    console.error('No jpg files found in frames_temp/');
    return;
  }

  // Get exact background color from the first frame's top-left pixel
  const firstFramePath = path.join(framesDir, selectedFiles[0]);
  const pixelBuffer = await sharp(firstFramePath)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer();
  
  const bgHex = `#${pixelBuffer[0].toString(16).padStart(2, '0')}${pixelBuffer[1].toString(16).padStart(2, '0')}${pixelBuffer[2].toString(16).padStart(2, '0')}`;
  console.log(`Detected background color from first frame: ${bgHex}`);
  // We'll output this to a file to use it in CSS later
  fs.writeFileSync(path.join(process.cwd(), 'bg-color.txt'), bgHex);

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const srcPath = path.join(framesDir, file);
    const destPath = path.join(targetDir, `frame_${i}.webp`);
    
    await sharp(srcPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(destPath);
      
    if (i % 20 === 0) console.log(`Processed ${i} / ${selectedFiles.length} frames...`);
  }

  console.log('Conversion completed!');
}

run().catch(console.error);
