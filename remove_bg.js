const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const THRESHOLD = 25;
const DIR = 'public/sequence';
const OUT = 'public/seq';

async function processFrame(filePath, outPath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height * 2);
  let head = 0, tail = 0;

  const enqueue = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const p = idx * channels;
    if (data[p] < THRESHOLD && data[p + 1] < THRESHOLD && data[p + 2] < THRESHOLD) {
      visited[idx] = 1;
      queue[tail++] = x;
      queue[tail++] = y;
    }
  };

  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 1; y < height - 1; y++) { enqueue(0, y); enqueue(width - 1, y); }

  while (head < tail) {
    const x = queue[head++];
    const y = queue[head++];
    data[(y * width + x) * channels + 3] = 0;
    if (x > 0)         enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0)         enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  const outBuf = await sharp(Buffer.from(data), { raw: { width, height, channels } })
    .webp({ lossless: false, quality: 90 })
    .toBuffer();

  fs.writeFileSync(outPath, outBuf);
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.webp')).sort();
  console.log(`Processing ${files.length} frames...`);
  let done = 0;
  for (const file of files) {
    await processFrame(path.join(DIR, file), path.join(OUT, file));
    done++;
    if (done % 20 === 0) process.stdout.write(`${done}/${files.length}\n`);
  }
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
