const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');
const { execSync } = require('child_process');

// === Config ===
const POSTER_WIDTH = 120;
const POSTER_HEIGHT = 170;
const GAP = 8;
const VIDEO_WIDTH = 1920;
const ROW1_COUNT = 50;
const ROW2_COUNT = 50;
const VIDEO_DURATION = 60; // seconds
const FPS = 30;
const TOTAL_FRAMES = VIDEO_DURATION * FPS;

const DATA_FILE = path.join(__dirname, '..', 'data', 'doubanTop100.ts');
const POSTER_DIR = path.join(__dirname, '..', 'public', 'posters-douban');
const LOCAL_POSTER_DIR = path.join(__dirname, '..', 'public', 'posters');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_VIDEO = path.join(OUTPUT_DIR, 'poster-wall.mp4');

// === Extract poster URLs from TS file ===
function extractMovies() {
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  const movies = [];
  const regex = /title:\s*"([^"]+)"[\s\S]*?poster:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    movies.push({ title: match[1], poster: match[2] });
  }
  console.log(`Found ${movies.length} movies`);
  return movies;
}

// === Download a single image ===
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://movie.douban.com/',
        'Accept': 'image/webp,image/apng,image/*'
      },
      timeout: 15000
    };

    const req = protocol.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// === Create grey placeholder ===
async function createPlaceholder() {
  return sharp({
    create: { width: POSTER_WIDTH, height: POSTER_HEIGHT, channels: 3, background: { r: 80, g: 80, b: 80 } }
  }).jpeg().toBuffer();
}

// === Download all posters ===
async function downloadAllPosters(movies) {
  const localPosters = fs.existsSync(LOCAL_POSTER_DIR) 
    ? fs.readdirSync(LOCAL_POSTER_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    : [];
  
  const posterBuffers = [];
  let downloaded = 0, failed = 0, cached = 0;
  const placeholder = await createPlaceholder();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const jpgName = `poster_${String(i).padStart(3, '0')}.jpg`;
    const jpgPath = path.join(POSTER_DIR, jpgName);

    // Check if already downloaded
    if (fs.existsSync(jpgPath)) {
      const buf = fs.readFileSync(jpgPath);
      posterBuffers.push(buf);
      cached++;
      process.stdout.write(`\r[${i + 1}/${movies.length}] Cached: ${movie.title}`);
      continue;
    }

    // Try downloading from douban
    let buffer = null;
    try {
      const raw = await downloadImage(movie.poster);
      // Convert webp to jpg via sharp
      buffer = await sharp(raw).resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer();
      downloaded++;
      process.stdout.write(`\r[${i + 1}/${movies.length}] Downloaded: ${movie.title}          `);
    } catch (err) {
      console.log(`\n  [WARN] Failed to download ${movie.title}: ${err.message}`);
      
      // Try using a local poster as fallback
      if (localPosters.length > 0) {
        const fallbackFile = localPosters[i % localPosters.length];
        try {
          buffer = await sharp(path.join(LOCAL_POSTER_DIR, fallbackFile))
            .resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover' })
            .jpeg({ quality: 85 })
            .toBuffer();
          console.log(`  [INFO] Using local fallback: ${fallbackFile}`);
        } catch (e2) {
          buffer = placeholder;
          console.log(`  [INFO] Using grey placeholder`);
        }
      } else {
        buffer = placeholder;
      }
      failed++;
    }

    // Save to cache
    fs.writeFileSync(jpgPath, buffer);
    posterBuffers.push(buffer);

    // Delay 1-2s between requests
    if (buffer !== placeholder) {
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    }
  }

  console.log(`\n\nDownload complete: ${downloaded} downloaded, ${cached} cached, ${failed} failed`);
  return posterBuffers;
}

// === Create a horizontal strip from poster buffers ===
async function createRowStrip(posterBuffers, label) {
  const count = posterBuffers.length;
  const singleWidth = count * (POSTER_WIDTH + GAP) - GAP; // no trailing gap
  // Double for seamless loop
  const totalWidth = singleWidth + GAP + singleWidth;

  console.log(`Creating ${label}: ${count} posters, single=${singleWidth}px, doubled=${totalWidth}px`);

  // Resize all posters to exact dimensions
  const resizedPosters = [];
  for (const buf of posterBuffers) {
    const resized = await sharp(buf)
      .resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover' })
      .jpeg()
      .toBuffer();
    resizedPosters.push(resized);
  }

  // Build composite operations for the doubled strip
  const composites = [];
  for (let copy = 0; copy < 2; copy++) {
    const offsetX = copy * (singleWidth + GAP);
    for (let i = 0; i < count; i++) {
      composites.push({
        input: resizedPosters[i],
        left: offsetX + i * (POSTER_WIDTH + GAP),
        top: 0
      });
    }
  }

  const strip = await sharp({
    create: {
      width: totalWidth,
      height: POSTER_HEIGHT,
      channels: 3,
      background: { r: 10, g: 10, b: 10 }
    }
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toBuffer();

  return { strip, singleWidth: singleWidth + GAP, totalWidth };
}

// === Generate video with ffmpeg ===
function generateVideo(row1Path, row2Path, row1Info, row2Info) {
  const totalHeight = POSTER_HEIGHT * 2 + GAP; // 170 + 8 + 170 = 348
  const row1SingleW = row1Info.singleWidth; // one cycle width
  const row2SingleW = row2Info.singleWidth;

  // Row 1: left to right, 60s per cycle
  // speed = singleWidth / totalFrames pixels per frame
  const row1Speed = (row1SingleW / TOTAL_FRAMES).toFixed(4);
  // Row 2: right to left, 80s per cycle → but video is 60s, so in 60s it moves 60/80 of the width
  const row2Speed = (row2SingleW / (80 * FPS)).toFixed(4);

  console.log(`\nRow1 speed: ${row1Speed} px/frame, Row2 speed: ${row2Speed} px/frame`);
  console.log(`Row1 singleWidth: ${row1SingleW}, Row2 singleWidth: ${row2SingleW}`);
  console.log(`Video: ${VIDEO_WIDTH}x${totalHeight}, ${FPS}fps, ${VIDEO_DURATION}s`);

  // Row 1 video (left to right scrolling: x increases)
  const row1Video = path.join(OUTPUT_DIR, 'row1.mp4');
  const row1Cmd = `ffmpeg -y -loop 1 -i "${row1Path}" -vf "crop=${VIDEO_WIDTH}:${POSTER_HEIGHT}:mod(n*${row1Speed}\\,${row1SingleW}):0" -t ${VIDEO_DURATION} -r ${FPS} -c:v libx264 -pix_fmt yuv420p -crf 23 "${row1Video}"`;
  console.log(`\nGenerating row1 video...`);
  console.log(row1Cmd);
  execSync(row1Cmd, { stdio: 'inherit' });

  // Row 2 video (right to left scrolling: x decreases, so start from end and go backwards)
  const row2Video = path.join(OUTPUT_DIR, 'row2.mp4');
  const row2Cmd = `ffmpeg -y -loop 1 -i "${row2Path}" -vf "crop=${VIDEO_WIDTH}:${POSTER_HEIGHT}:${row2SingleW}-mod(n*${row2Speed}\\,${row2SingleW}):0" -t ${VIDEO_DURATION} -r ${FPS} -c:v libx264 -pix_fmt yuv420p -crf 23 "${row2Video}"`;
  console.log(`\nGenerating row2 video...`);
  console.log(row2Cmd);
  execSync(row2Cmd, { stdio: 'inherit' });

  // Combine two rows with gap
  const combineCmd = `ffmpeg -y -i "${row1Video}" -i "${row2Video}" -filter_complex "[0:v]pad=${VIDEO_WIDTH}:${totalHeight}:0:0:color=0a0a0a[top];[top][1:v]overlay=0:${POSTER_HEIGHT + GAP}" -c:v libx264 -crf 23 -pix_fmt yuv420p "${OUTPUT_VIDEO}"`;
  console.log(`\nCombining rows...`);
  console.log(combineCmd);
  execSync(combineCmd, { stdio: 'inherit' });

  // Clean up temp files
  try {
    fs.unlinkSync(row1Video);
    fs.unlinkSync(row2Video);
  } catch (e) {}

  console.log(`\nVideo generated: ${OUTPUT_VIDEO}`);
  const stats = fs.statSync(OUTPUT_VIDEO);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

// === Main ===
async function main() {
  console.log('=== Poster Wall Video Generator ===\n');

  // 1. Extract movie data
  const movies = extractMovies();
  if (movies.length === 0) {
    console.error('No movies found!');
    process.exit(1);
  }

  // 2. Download all posters
  const posterBuffers = await downloadAllPosters(movies);

  // 3. Split into two rows
  const row1Buffers = posterBuffers.slice(0, ROW1_COUNT);
  const row2Buffers = posterBuffers.slice(ROW1_COUNT, ROW1_COUNT + ROW2_COUNT);

  // Pad if needed
  const placeholder = await createPlaceholder();
  while (row1Buffers.length < ROW1_COUNT) row1Buffers.push(placeholder);
  while (row2Buffers.length < ROW2_COUNT) row2Buffers.push(placeholder);

  // 4. Create horizontal strips
  const row1Result = await createRowStrip(row1Buffers, 'Row 1');
  const row2Result = await createRowStrip(row2Buffers, 'Row 2');

  // Save strips to files
  const row1ImgPath = path.join(OUTPUT_DIR, 'row1_doubled.jpg');
  const row2ImgPath = path.join(OUTPUT_DIR, 'row2_doubled.jpg');
  fs.writeFileSync(row1ImgPath, row1Result.strip);
  fs.writeFileSync(row2ImgPath, row2Result.strip);
  console.log(`\nStrips saved: row1_doubled.jpg (${(row1Result.strip.length / 1024).toFixed(0)} KB), row2_doubled.jpg (${(row2Result.strip.length / 1024).toFixed(0)} KB)`);

  // 5. Generate video
  generateVideo(row1ImgPath, row2ImgPath, row1Result, row2Result);

  // 6. Clean up strip images
  try {
    fs.unlinkSync(row1ImgPath);
    fs.unlinkSync(row2ImgPath);
  } catch (e) {}

  console.log('\n=== Done! ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
