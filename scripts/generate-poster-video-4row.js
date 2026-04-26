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
const VIDEO_HEIGHT = POSTER_HEIGHT * 4 + GAP * 3; // 170*4 + 8*3 = 704
const VIDEO_DURATION = 60;
const FPS = 30;
const TOTAL_FRAMES = VIDEO_DURATION * FPS;
const POSTERS_PER_ROW = 50;

const DATA_FILE = path.join(__dirname, '..', 'data', 'doubanTop200.ts');
const POSTER_DIR = path.join(__dirname, '..', 'public', 'posters-douban');
const LOCAL_POSTER_DIR = path.join(__dirname, '..', 'public', 'posters');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_VIDEO = path.join(OUTPUT_DIR, 'poster-wall.mp4');

// Row configs: [startIndex, endIndex, direction, cyclePeriod]
const ROW_CONFIGS = [
  { start: 0,   end: 50,  direction: 'ltr', period: 60 },  // Row 1: 1-50, left→right, 60s
  { start: 50,  end: 100, direction: 'rtl', period: 75 },  // Row 2: 51-100, right→left, 75s
  { start: 100, end: 150, direction: 'ltr', period: 70 },  // Row 3: 101-150, left→right, 70s
  { start: 150, end: 200, direction: 'rtl', period: 80 },  // Row 4: 151-200, right→left, 80s
];

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
      process.stdout.write(`\r[${i + 1}/${movies.length}] Cached: ${movie.title}          `);
      continue;
    }

    // Try downloading from douban
    let buffer = null;
    try {
      const raw = await downloadImage(movie.poster);
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

// === Create a horizontal strip from poster buffers (doubled for seamless loop) ===
async function createRowStrip(posterBuffers, label) {
  const count = posterBuffers.length;
  const singleWidth = count * (POSTER_WIDTH + GAP) - GAP;
  const totalWidth = singleWidth + GAP + singleWidth;

  console.log(`Creating ${label}: ${count} posters, single=${singleWidth}px, doubled=${totalWidth}px`);

  const resizedPosters = [];
  for (const buf of posterBuffers) {
    const resized = await sharp(buf)
      .resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover' })
      .jpeg()
      .toBuffer();
    resizedPosters.push(resized);
  }

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
      background: { r: 10, g: 14, b: 26 } // #0a0e1a
    }
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toBuffer();

  return { strip, singleWidth: singleWidth + GAP, totalWidth };
}

// === Generate 4-row video with ffmpeg ===
function generateVideo(rowPaths, rowInfos) {
  // Generate individual row videos
  const rowVideos = [];

  for (let r = 0; r < 4; r++) {
    const cfg = ROW_CONFIGS[r];
    const singleW = rowInfos[r].singleWidth;
    const speed = (singleW / (cfg.period * FPS)).toFixed(4);
    const rowVideo = path.join(OUTPUT_DIR, `row${r + 1}.mp4`);
    rowVideos.push(rowVideo);

    let cropExpr;
    if (cfg.direction === 'ltr') {
      // Left to right: x increases
      cropExpr = `mod(n*${speed}\\,${singleW})`;
    } else {
      // Right to left: x decreases from singleW
      cropExpr = `${singleW}-mod(n*${speed}\\,${singleW})`;
    }

    const cmd = `ffmpeg -y -loop 1 -i "${rowPaths[r]}" -vf "crop=${VIDEO_WIDTH}:${POSTER_HEIGHT}:${cropExpr}:0" -t ${VIDEO_DURATION} -r ${FPS} -c:v libx264 -pix_fmt yuv420p -crf 23 "${rowVideo}"`;
    console.log(`\nGenerating row ${r + 1} video (${cfg.direction}, ${cfg.period}s period, speed=${speed} px/frame)...`);
    execSync(cmd, { stdio: 'inherit' });
  }

  // Combine 4 rows with gaps using background color #0a0e1a
  // Stack vertically with 8px gap filled by background color
  const combineCmd = `ffmpeg -y -i "${rowVideos[0]}" -i "${rowVideos[1]}" -i "${rowVideos[2]}" -i "${rowVideos[3]}" -filter_complex "[0:v]pad=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:0:0:color=0x0a0e1a[r0];[r0][1:v]overlay=0:${POSTER_HEIGHT + GAP}[r1];[r1][2:v]overlay=0:${(POSTER_HEIGHT + GAP) * 2}[r2];[r2][3:v]overlay=0:${(POSTER_HEIGHT + GAP) * 3}" -c:v libx264 -crf 23 -pix_fmt yuv420p "${OUTPUT_VIDEO}"`;
  console.log(`\nCombining 4 rows...`);
  execSync(combineCmd, { stdio: 'inherit' });

  // Clean up temp files
  for (const v of rowVideos) {
    try { fs.unlinkSync(v); } catch (e) {}
  }

  console.log(`\nVideo generated: ${OUTPUT_VIDEO}`);
  const stats = fs.statSync(OUTPUT_VIDEO);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

// === Main ===
async function main() {
  console.log('=== 4-Row Poster Wall Video Generator ===\n');
  console.log(`Video dimensions: ${VIDEO_WIDTH}x${VIDEO_HEIGHT}, ${FPS}fps, ${VIDEO_DURATION}s\n`);

  // Ensure poster dir exists
  if (!fs.existsSync(POSTER_DIR)) {
    fs.mkdirSync(POSTER_DIR, { recursive: true });
  }

  // 1. Extract movie data
  const movies = extractMovies();
  if (movies.length < 200) {
    console.warn(`Warning: Only ${movies.length} movies found, expected 200`);
  }

  // 2. Download all posters (will use cache for already downloaded ones)
  const posterBuffers = await downloadAllPosters(movies);

  // 3. Split into 4 rows of 50 each
  const placeholder = await createPlaceholder();
  const rows = [];
  for (let r = 0; r < 4; r++) {
    const cfg = ROW_CONFIGS[r];
    const rowBufs = posterBuffers.slice(cfg.start, cfg.end);
    while (rowBufs.length < POSTERS_PER_ROW) rowBufs.push(placeholder);
    rows.push(rowBufs);
  }

  // 4. Create horizontal strips
  const rowResults = [];
  const rowImgPaths = [];
  for (let r = 0; r < 4; r++) {
    const result = await createRowStrip(rows[r], `Row ${r + 1}`);
    rowResults.push(result);
    const imgPath = path.join(OUTPUT_DIR, `row${r + 1}_doubled.jpg`);
    fs.writeFileSync(imgPath, result.strip);
    rowImgPaths.push(imgPath);
    console.log(`  Strip saved: row${r + 1}_doubled.jpg (${(result.strip.length / 1024).toFixed(0)} KB)`);
  }

  // 5. Generate video
  generateVideo(rowImgPaths, rowResults);

  // 6. Clean up strip images
  for (const p of rowImgPaths) {
    try { fs.unlinkSync(p); } catch (e) {}
  }

  console.log('\n=== Done! ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
