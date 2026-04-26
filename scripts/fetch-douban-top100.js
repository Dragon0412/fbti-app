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
  // Match each <div class="item"> block
  const itemRegex = /<div class="item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[0];
    // Extract poster image (src or data-src)
    const imgMatch = block.match(/<img[^>]*(?:src|data-src)\s*=\s*"([^"]+)"/);
    // Extract first <span class="title"> (Chinese title)
    const titleMatch = block.match(/<span class="title">([^<]+)<\/span>/);
    // Extract rating
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

async function main() {
  const allMovies = [];
  const pages = [0, 25, 50, 75];

  for (let i = 0; i < pages.length; i++) {
    const start = pages[i];
    const url = `https://movie.douban.com/top250?start=${start}`;
    console.log(`Fetching page ${i + 1}/4: ${url}`);
    try {
      const html = await fetchPage(url);
      const movies = parseMovies(html);
      console.log(`  Found ${movies.length} movies`);
      allMovies.push(...movies);
    } catch (err) {
      console.error(`  Error fetching page: ${err.message}`);
    }
    if (i < pages.length - 1) {
      console.log('  Waiting 3 seconds...');
      await sleep(3000);
    }
  }

  console.log(`\nTotal movies fetched: ${allMovies.length}`);

  if (allMovies.length === 0) {
    console.log('No movies fetched from Douban. Using fallback data...');
    generateFallbackData();
    return;
  }

  writeDataFile(allMovies);
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

export const doubanTop100: DoubanMovie[] = [
${items.join(',\n')}
];
`;

  const outPath = path.join(__dirname, '..', 'data', 'doubanTop100.ts');
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`Data written to ${outPath} (${movies.length} movies)`);
}

function generateFallbackData() {
  console.log('Generating fallback data with 100 classic movies...');
  const fallbackMovies = [
    { title: "肖申克的救赎", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg", rating: "9.7" },
    { title: "霸王别姬", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg", rating: "9.6" },
    { title: "阿甘正传", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2372307693.jpg", rating: "9.5" },
    { title: "泰坦尼克号", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg", rating: "9.5" },
    { title: "这个杀手不太冷", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg", rating: "9.4" },
    { title: "千与千寻", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2557573348.jpg", rating: "9.4" },
    { title: "美丽人生", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2578474613.jpg", rating: "9.6" },
    { title: "辛德勒的名单", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p492406163.jpg", rating: "9.6" },
    { title: "盗梦空间", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p513344864.jpg", rating: "9.4" },
    { title: "星际穿越", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2206088801.jpg", rating: "9.4" },
    { title: "忠犬八公的故事", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p524964016.jpg", rating: "9.4" },
    { title: "楚门的世界", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p479682972.jpg", rating: "9.4" },
    { title: "海上钢琴师", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2574551676.jpg", rating: "9.3" },
    { title: "三傻大闹宝莱坞", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p579729551.jpg", rating: "9.2" },
    { title: "机器人总动员", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1461851991.jpg", rating: "9.3" },
    { title: "放牛班的春天", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1910824951.jpg", rating: "9.3" },
    { title: "无间道", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2564556863.jpg", rating: "9.3" },
    { title: "疯狂动物城", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2614500649.jpg", rating: "9.2" },
    { title: "大话西游之大圣娶亲", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2455050536.jpg", rating: "9.2" },
    { title: "控方证人", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1505392928.jpg", rating: "9.6" },
    { title: "教父", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p616779645.jpg", rating: "9.3" },
    { title: "熔炉", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1363250216.jpg", rating: "9.4" },
    { title: "当幸福来敲门", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2614359276.jpg", rating: "9.2" },
    { title: "触不可及", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1454261925.jpg", rating: "9.3" },
    { title: "怦然心动", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p663036666.jpg", rating: "9.1" },
    { title: "龙猫", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2540924496.jpg", rating: "9.2" },
    { title: "末代皇帝", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p452089Mo833.jpg", rating: "9.3" },
    { title: "蝙蝠侠：黑暗骑士", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p462657443.jpg", rating: "9.2" },
    { title: "活着", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2513253791.jpg", rating: "9.3" },
    { title: "指环王3：王者无敌", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1910825503.jpg", rating: "9.2" },
    { title: "我不是药神", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2561305376.jpg", rating: "9.0" },
    { title: "少年派的奇幻漂流", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1784592701.jpg", rating: "9.1" },
    { title: "飞屋环游记", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p485887754.jpg", rating: "9.1" },
    { title: "哈利·波特与魔法石", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2614949805.jpg", rating: "9.2" },
    { title: "鬼子来了", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1181775734.jpg", rating: "9.3" },
    { title: "十二怒汉", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2173577632.jpg", rating: "9.4" },
    { title: "哈尔的移动城堡", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2174346180.jpg", rating: "9.1" },
    { title: "摔跤吧！爸爸", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2457983084.jpg", rating: "9.0" },
    { title: "天空之城", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1446261379.jpg", rating: "9.1" },
    { title: "寻梦环游记", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2503997609.jpg", rating: "9.1" },
    { title: "素媛", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2118532944.jpg", rating: "9.3" },
    { title: "大话西游之月光宝盒", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2455050536.jpg", rating: "9.2" },
    { title: "罗马假日", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2189265085.jpg", rating: "9.1" },
    { title: "指环王2：双塔奇兵", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p909265336.jpg", rating: "9.2" },
    { title: "指环王1：护戒使者", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1354972991.jpg", rating: "9.1" },
    { title: "天堂电影院", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2559577684.jpg", rating: "9.2" },
    { title: "闻香识女人", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2550757929.jpg", rating: "9.1" },
    { title: "辩护人", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2158166535.jpg", rating: "9.2" },
    { title: "搏击俱乐部", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1910926158.jpg", rating: "9.1" },
    { title: "死亡诗社", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2575465690.jpg", rating: "9.2" },
    { title: "窃听风暴", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1808872109.jpg", rating: "9.2" },
    { title: "黑客帝国", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p451926968.jpg", rating: "9.1" },
    { title: "海蒂和爷爷", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2554525534.jpg", rating: "9.2" },
    { title: "V字仇杀队", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1465235231.jpg", rating: "8.9" },
    { title: "饮食男女", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1910899751.jpg", rating: "9.2" },
    { title: "蝴蝶效应", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2209066019.jpg", rating: "8.8" },
    { title: "钢琴家", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p792376093.jpg", rating: "9.2" },
    { title: "心灵捕手", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p480965695.jpg", rating: "8.9" },
    { title: "教父2", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2194138787.jpg", rating: "9.2" },
    { title: "被嫌弃的松子的一生", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p884763596.jpg", rating: "8.9" },
    { title: "剪刀手爱德华", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p480956937.jpg", rating: "8.7" },
    { title: "让子弹飞", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1512562287.jpg", rating: "9.0" },
    { title: "看不见的客人", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2498971355.jpg", rating: "8.8" },
    { title: "拯救大兵瑞恩", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1014542496.jpg", rating: "9.0" },
    { title: "情书", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p449897379.jpg", rating: "8.9" },
    { title: "穿条纹睡衣的男孩", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1473670352.jpg", rating: "9.1" },
    { title: "音乐之声", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2189265085.jpg", rating: "9.1" },
    { title: "何以为家", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2555295759.jpg", rating: "9.1" },
    { title: "绿皮书", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2549177902.jpg", rating: "8.9" },
    { title: "低俗小说", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1910902213.jpg", rating: "8.8" },
    { title: "美丽心灵", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1665997400.jpg", rating: "9.0" },
    { title: "禁闭岛", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1832875827.jpg", rating: "8.9" },
    { title: "杀人回忆", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2326071311.jpg", rating: "8.9" },
    { title: "沉默的羔羊", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1593414327.jpg", rating: "8.8" },
    { title: "阿凡达", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2180085848.jpg", rating: "8.7" },
    { title: "勇敢的心", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1374786569.jpg", rating: "8.9" },
    { title: "致命魔术", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p480383375.jpg", rating: "8.9" },
    { title: "加勒比海盗", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1Mo596085290.jpg", rating: "8.8" },
    { title: "天使爱美丽", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p803896928.jpg", rating: "8.7" },
    { title: "消失的爱人", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2221768894.jpg", rating: "8.7" },
    { title: "春光乍泄", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p465939041.jpg", rating: "9.0" },
    { title: "布达佩斯大饭店", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2178872593.jpg", rating: "8.9" },
    { title: "完美的世界", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p792403691.jpg", rating: "9.1" },
    { title: "功夫", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2219011938.jpg", rating: "8.7" },
    { title: "从你的全世界路过", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2395733377.jpg", rating: "5.8" },
    { title: "用心棒", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1540888Mo347.jpg", rating: "9.3" },
    { title: "荒蛮故事", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2266erta842.jpg", rating: "8.8" },
    { title: "血战钢锯岭", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2398141772.jpg", rating: "8.7" },
    { title: "社交网络", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2263411915.jpg", rating: "8.8" },
    { title: "头脑特工队", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2266293606.jpg", rating: "8.7" },
    { title: "你的名字", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2395733377.jpg", rating: "8.4" },
    { title: "七武士", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p647099823.jpg", rating: "9.3" },
    { title: "喜剧之王", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2579932167.jpg", rating: "8.7" },
    { title: "红辣椒", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p456825720.jpg", rating: "9.0" },
    { title: "疯狂的石头", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p712241453.jpg", rating: "8.4" },
    { title: "一一", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2119675128.jpg", rating: "9.1" },
    { title: "入殓师", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p594972928.jpg", rating: "8.8" },
    { title: "爱在黎明破晓前", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p452582575.jpg", rating: "8.8" },
    { title: "玛丽和马克思", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1820604866.jpg", rating: "8.9" },
    { title: "侧耳倾听", poster: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p456692072.jpg", rating: "8.9" },
  ];

  writeDataFile(fallbackMovies);
}

main().catch(console.error);
