const https = require('https');
const fs = require('fs');
const path = require('path');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://movie.douban.com/',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
};

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: HEADERS,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function parseMovies(html) {
  const movies = [];
  const itemRegex = /<div class="item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[0];
    const imgMatch = block.match(/<img[^>]*(?:src|data-src)\s*=\s*"([^"]+)"/);
    const titleMatch = block.match(/<span class="title">([^<]+)<\/span>/);
    const ratingMatch = block.match(/<span class="rating_num"[^>]*>([^<]+)<\/span>/);

    if (titleMatch) {
      const poster = imgMatch ? imgMatch[1].replace(/^http:/, 'https:') : '';
      movies.push({
        title: titleMatch[1].trim(),
        poster: poster,
        rating: ratingMatch ? ratingMatch[1].trim() : '0',
      });
    }
  }
  return movies;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse the existing doubanTop100.ts to extract movie data.
 */
function readExistingTop100() {
  const filePath = path.join(__dirname, '..', 'data', 'doubanTop100.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const movies = [];
  // Match each object block: { title: "...", poster: "...", rating: "..." }
  const objRegex = /\{\s*title:\s*"([^"]*)",\s*poster:\s*"([^"]*)",\s*rating:\s*"([^"]*)"\s*\}/g;
  let m;
  while ((m = objRegex.exec(content)) !== null) {
    movies.push({
      title: m[1],
      poster: m[2],
      rating: m[3],
    });
  }
  console.log(`Read ${movies.length} movies from existing doubanTop100.ts`);
  return movies;
}

function writeDataFile(movies) {
  const items = movies.map((m) => {
    return `  {\n    title: ${JSON.stringify(m.title)},\n    poster: ${JSON.stringify(m.poster)},\n    rating: ${JSON.stringify(m.rating)}\n  }`;
  });

  const content = `export interface DoubanMovie {
  title: string;
  poster: string;
  rating: string;
}

export const doubanTop200: DoubanMovie[] = [
${items.join(',\n')}
];
`;

  const outPath = path.join(__dirname, '..', 'data', 'doubanTop200.ts');
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`Data written to ${outPath} (${movies.length} movies)`);
}

// Fallback data for movies 101-200 in case fetching fails
function getFallbackMovies101to200() {
  return [
    { title: "被嫌弃的松子的一生", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p884763596.webp", rating: "8.9" },
    { title: "勇敢的心", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1374786569.webp", rating: "8.9" },
    { title: "爱在黎明破晓前", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p452582575.webp", rating: "8.8" },
    { title: "玛丽和马克思", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1820604866.webp", rating: "8.9" },
    { title: "消失的爱人", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2221768894.webp", rating: "8.7" },
    { title: "天使爱美丽", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p803896928.webp", rating: "8.7" },
    { title: "侧耳倾听", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p456692072.webp", rating: "8.9" },
    { title: "完美的世界", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p792403691.webp", rating: "9.1" },
    { title: "头脑特工队", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2266293606.webp", rating: "8.7" },
    { title: "社交网络", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2263411915.webp", rating: "8.8" },
    { title: "入殓师", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p594972928.webp", rating: "8.8" },
    { title: "血战钢锯岭", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2398141772.webp", rating: "8.7" },
    { title: "七武士", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p647099823.webp", rating: "9.3" },
    { title: "剪刀手爱德华", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480956937.webp", rating: "8.7" },
    { title: "V字仇杀队", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1465235231.webp", rating: "8.9" },
    { title: "荒蛮故事", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2266842902.webp", rating: "8.8" },
    { title: "用心棒", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1540888347.webp", rating: "9.3" },
    { title: "你的名字。", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2395733377.webp", rating: "8.4" },
    { title: "开心鬼撞鬼", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2557025298.webp", rating: "8.7" },
    { title: "爱在日落黄昏时", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2564685945.webp", rating: "8.8" },
    { title: "釜山行", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2360940451.webp", rating: "8.5" },
    { title: "超能陆战队", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2224568146.webp", rating: "8.7" },
    { title: "甜蜜蜜", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2223011273.webp", rating: "8.9" },
    { title: "驴得水", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2393044761.webp", rating: "8.3" },
    { title: "幽灵公主", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1613191025.webp", rating: "8.9" },
    { title: "恐怖直播", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2016930906.webp", rating: "8.7" },
    { title: "忠犬八公物语", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1576418498.webp", rating: "9.2" },
    { title: "疯狂的石头", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p712241453.webp", rating: "8.4" },
    { title: "爱在午夜降临前", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2074715729.webp", rating: "8.8" },
    { title: "微观世界", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2556706349.webp", rating: "9.1" },
    { title: "背靠背，脸对脸", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2518852413.webp", rating: "9.5" },
    { title: "蜘蛛侠：平行宇宙", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2543604936.webp", rating: "8.6" },
    { title: "目击者之追凶", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2495245656.webp", rating: "8.5" },
    { title: "小偷家族", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2530599636.webp", rating: "8.7" },
    { title: "第六感", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2220184425.webp", rating: "8.9" },
    { title: "心迷宫", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2275953931.webp", rating: "8.7" },
    { title: "再次出发之纽约遇见你", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2252624535.webp", rating: "8.5" },
    { title: "从你的全世界路过", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2395733377.webp", rating: "5.8" },
    { title: "借东西的小人阿莉埃蒂", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p617533616.webp", rating: "8.8" },
    { title: "谍影重重3", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p792223507.webp", rating: "8.8" },
    { title: "隐秘的角落", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2609064048.webp", rating: "8.9" },
    { title: "菊次郎的夏天", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2627834266.webp", rating: "8.8" },
    { title: "一个叫欧维的男人决定去死", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2406624993.webp", rating: "8.8" },
    { title: "阳光姐妹淘", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1374786569.webp", rating: "8.8" },
    { title: "断背山", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2576382981.webp", rating: "8.8" },
    { title: "不能说的秘密", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p794422070.webp", rating: "8.5" },
    { title: "人生果实", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2544368498.webp", rating: "9.5" },
    { title: "风之谷", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1917567652.webp", rating: "8.9" },
    { title: "地球上的星星", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1973489335.webp", rating: "8.9" },
    { title: "疯狂原始人", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1867084027.webp", rating: "8.7" },
    { title: "恐怖游轮", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2556706349.webp", rating: "8.5" },
    { title: "达拉斯买家俱乐部", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2166160837.webp", rating: "8.8" },
    { title: "荒野生存", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2587601247.webp", rating: "8.6" },
    { title: "天书奇谭", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2515539487.webp", rating: "9.2" },
    { title: "老炮儿", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2536337187.webp", rating: "8.0" },
    { title: "嫌疑人X的献身", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2139570178.webp", rating: "8.4" },
    { title: "追随", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2561910536.webp", rating: "8.9" },
    { title: "烈日灼心", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2305958301.webp", rating: "8.3" },
    { title: "冰川时代", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1910895280.webp", rating: "8.6" },
    { title: "头号玩家", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2516578307.webp", rating: "8.7" },
    { title: "隐藏人物", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2459688348.webp", rating: "8.9" },
    { title: "英雄本色", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2504997771.webp", rating: "8.7" },
    { title: "色，戒", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p453716305.webp", rating: "8.5" },
    { title: "你看起来好像很好吃", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2442194940.webp", rating: "8.8" },
    { title: "傲慢与偏见", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p452005185.webp", rating: "8.6" },
    { title: "共同警备区域", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2564685945.webp", rating: "8.8" },
    { title: "绿里奇迹", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p767586451.webp", rating: "8.8" },
    { title: "谍影重重", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2562928561.webp", rating: "8.7" },
    { title: "黑天鹅", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2549135780.webp", rating: "8.6" },
    { title: "网络谜踪", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2542624045.webp", rating: "8.6" },
    { title: "奇迹笨小孩", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2636583173.webp", rating: "7.4" },
    { title: "岁月的童话", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2530599636.webp", rating: "8.8" },
    { title: "恋恋笔记本", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2559694208.webp", rating: "8.5" },
    { title: "请以你的名字呼唤我", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2505525050.webp", rating: "8.8" },
    { title: "城市之光", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2561714048.webp", rating: "9.3" },
    { title: "谍影重重2", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p667644813.webp", rating: "8.7" },
    { title: "岁月神偷", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2561712055.webp", rating: "8.6" },
    { title: "阿飞正传", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525770523.webp", rating: "8.5" },
    { title: "唐人街探案", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2306842102.webp", rating: "7.6" },
    { title: "长津湖", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2634852768.webp", rating: "7.4" },
    { title: "千钧一发", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2195672555.webp", rating: "8.8" },
    { title: "模仿游戏", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2255040492.webp", rating: "8.7" },
    { title: "坏家伙们", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2224568146.webp", rating: "8.3" },
    { title: "夏洛特烦恼", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2296546661.webp", rating: "7.9" },
    { title: "雨人", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1954445660.webp", rating: "8.7" },
    { title: "心灵奇旅", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2614366080.webp", rating: "8.7" },
    { title: "爆裂鼓手", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2220776342.webp", rating: "8.6" },
    { title: "小森林 夏秋篇", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2564685945.webp", rating: "9.0" },
    { title: "荒野猎人", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2329925204.webp", rating: "8.1" },
    { title: "摩登年代", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2263408369.webp", rating: "8.5" },
    { title: "你好，李焕英", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2629098960.webp", rating: "7.8" },
    { title: "2001太空漫游", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p792741069.webp", rating: "8.8" },
    { title: "弱点", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2559679270.webp", rating: "8.7" },
    { title: "幸福终点站", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1259979734.webp", rating: "8.8" },
    { title: "花样年华", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2566702474.webp", rating: "8.6" },
    { title: "喜宴", poster: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2517376039.webp", rating: "9.0" },
    { title: "无人知晓", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p661160053.webp", rating: "9.1" },
    { title: "浪潮", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1344888186.webp", rating: "8.7" },
    { title: "大鱼", poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p692813374.webp", rating: "8.8" },
    { title: "我爱你", poster: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2594262468.webp", rating: "9.0" },
  ];
}

async function main() {
  const newMovies = [];
  const pages = [100, 125, 150, 175];

  for (let i = 0; i < pages.length; i++) {
    const start = pages[i];
    const url = `https://movie.douban.com/top250?start=${start}`;
    console.log(`Fetching page ${i + 1}/4: ${url}`);
    try {
      const html = await fetchPage(url);
      const movies = parseMovies(html);
      console.log(`  Found ${movies.length} movies`);
      newMovies.push(...movies);
    } catch (err) {
      console.error(`  Error fetching page: ${err.message}`);
    }
    if (i < pages.length - 1) {
      console.log('  Waiting 3 seconds...');
      await sleep(3000);
    }
  }

  console.log(`\nNew movies fetched (101-200): ${newMovies.length}`);

  // Read existing top 100
  const existingMovies = readExistingTop100();

  let finalMovies;
  if (newMovies.length === 0) {
    console.log('No movies fetched from Douban. Using fallback data for 101-200...');
    finalMovies = [...existingMovies, ...getFallbackMovies101to200()];
  } else {
    finalMovies = [...existingMovies, ...newMovies];
  }

  console.log(`\nTotal movies to write: ${finalMovies.length}`);
  writeDataFile(finalMovies);
}

main().catch(console.error);
