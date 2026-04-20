/**
 * 海报下载脚本
 * 从 TMDB 下载电影海报到本地，并生成静态映射文件
 * 
 * 注意：国内网络可能无法直接访问 TMDB API，如果执行失败请使用 VPN 后再试
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TMDB_API_KEY = "05b5d0763ad31ee3e57d8afc18b25a48";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

// 中英文标题映射
const movieTitleMap = {
  "星际穿越": "Interstellar",
  "坠落的审判": "Anatomy of a Fall",
  "一次别离": "A Separation",
  "霸王别姬": "Farewell My Concubine",
  "活着": "To Live",
  "大话西游之大圣娶亲": "A Chinese Odyssey Part Two",
  "让子弹飞": "Let the Bullets Fly",
  "真爱至上": "Love Actually",
  "小鬼当家": "Home Alone",
  "天书奇谭": "The Legends of Sealed Book",
  "月球": "Moon",
  "沙丘": "Dune",
  "小丑": "Joker",
  "无间道": "Infernal Affairs",
  "心灵奇旅": "Soul",
  "蜘蛛侠：平行宇宙": "Spider-Man: Into the Spider-Verse",
  "春光乍泄": "Happy Together",
  "月光男孩": "Moonlight",
  "米尔克": "Milk",
  "逃出绝命镇": "Get Out",
  "别告诉她": "The Farewell",
  "黑豹": "Black Panther",
  "阿甘正传": "Forrest Gump",
  "出租车司机": "Taxi Driver",
  "小偷家族": "Shoplifters",
  "寄生虫": "Parasite",
  "龙猫": "My Neighbor Totoro",
  "佛罗里达乐园": "The Florida Project",
  "火星救援": "The Martian",
  "银翼杀手": "Blade Runner",
  "星球大战": "Star Wars",
  "色，戒": "Lust, Caution",
  "发条橙": "A Clockwork Orange",
  "颐和园": "Summer Palace",
  "索多玛120天": "Salò, or the 120 Days of Sodom",
  "徒手攀岩": "Free Solo",
  "闪灵": "The Shining",
  "摩登时代": "Modern Times",
  "信条": "Tenet",
  "荒野生存": "Into the Wild",
  "疯狂的麦克斯：狂暴之路": "Mad Max: Fury Road",
  "触不可及": "The Intouchables",
  "龙虾": "The Lobster",
  "V字仇杀队": "V for Vendetta",
};

// 电影列表（43部）
const movies = [
  { title: "星际穿越", year: 2014 },
  { title: "坠落的审判", year: 2023 },
  { title: "一次别离", year: 2011 },
  { title: "霸王别姬", year: 1993 },
  { title: "活着", year: 1994 },
  { title: "大话西游之大圣娶亲", year: 1995 },
  { title: "让子弹飞", year: 2010 },
  { title: "真爱至上", year: 2003 },
  { title: "小鬼当家", year: 1990 },
  { title: "天书奇谭", year: 1983 },
  { title: "月球", year: 2009 },
  { title: "沙丘", year: 2021 },
  { title: "小丑", year: 2019 },
  { title: "无间道", year: 2002 },
  { title: "心灵奇旅", year: 2020 },
  { title: "蜘蛛侠：平行宇宙", year: 2018 },
  { title: "春光乍泄", year: 1997 },
  { title: "月光男孩", year: 2016 },
  { title: "米尔克", year: 2008 },
  { title: "逃出绝命镇", year: 2017 },
  { title: "别告诉她", year: 2019 },
  { title: "黑豹", year: 2018 },
  { title: "阿甘正传", year: 1994 },
  { title: "出租车司机", year: 1976 },
  { title: "小偷家族", year: 2018 },
  { title: "寄生虫", year: 2019 },
  { title: "龙猫", year: 1988 },
  { title: "佛罗里达乐园", year: 2017 },
  { title: "火星救援", year: 2015 },
  { title: "银翼杀手", year: 1982 },
  { title: "星球大战", year: 1977 },
  { title: "色，戒", year: 2007 },
  { title: "发条橙", year: 1971 },
  { title: "颐和园", year: 2006 },
  { title: "索多玛120天", year: 1975 },
  { title: "徒手攀岩", year: 2018 },
  { title: "闪灵", year: 1980 },
  { title: "摩登时代", year: 1936 },
  { title: "信条", year: 2020 },
  { title: "荒野生存", year: 2007 },
  { title: "疯狂的麦克斯：狂暴之路", year: 2015 },
  { title: "触不可及", year: 2011 },
  { title: "龙虾", year: 2015 },
  { title: "V字仇杀队", year: 2005 },
];

// 生成 slug（小写英文，空格和特殊字符转为连字符）
function generateSlug(enTitle) {
  return enTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 使用 https 模块进行 fetch（兼容性好）
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 30000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('JSON parse error'));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// 下载图片
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, { timeout: 60000 }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(destPath, () => {});
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    req.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      reject(new Error('Download timeout'));
    });
  });
}

// 搜索电影
async function searchMovie(query, year) {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query,
      language: "zh-CN",
    });
    if (year) {
      params.append("year", year.toString());
    }

    const url = `${TMDB_BASE_URL}/search/movie?${params.toString()}`;
    const data = await fetchJson(url);
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`  Error searching "${query}":`, error.message);
    return null;
  }
}

// 生成完整的 posterMap（无论下载是否成功）
function generatePosterMapFile() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 为所有电影生成映射
  const fullPosterMap = {};
  for (const movie of movies) {
    const enTitle = movieTitleMap[movie.title];
    const slug = generateSlug(enTitle);
    fullPosterMap[movie.title] = `/posters/${slug}.jpg`;
  }

  const posterMapContent = `// 自动生成的海报映射文件
// 由 scripts/download-posters.js 生成
// 生成时间: ${new Date().toISOString()}

export const POSTER_MAP: Record<string, string> = {
${Object.entries(fullPosterMap).map(([zh, path]) => `  "${zh}": "${path}",`).join('\n')}
};
`;

  const posterMapPath = path.join(dataDir, 'posterMap.ts');
  fs.writeFileSync(posterMapPath, posterMapContent, 'utf-8');
  console.log(`\n✓ 已生成映射文件: ${posterMapPath}`);
  return posterMapPath;
}

// 主函数
async function main() {
  console.log("=".repeat(60));
  console.log("TMDB 海报下载脚本");
  console.log("=".repeat(60));
  console.log(`共 ${movies.length} 部电影需要处理`);
  console.log("注意: 国内网络可能需要 VPN 才能访问 TMDB API\n");

  const posterMap = {};
  const postersDir = path.join(__dirname, '..', 'public', 'posters');
  
  // 确保目录存在
  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }

  let successCount = 0;
  let failCount = 0;
  let networkFailed = false;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const enTitle = movieTitleMap[movie.title];
    const slug = generateSlug(enTitle);
    
    console.log(`[${i + 1}/${movies.length}] ${movie.title} (${enTitle})`);
    
    // 搜索电影
    const tmdbMovie = await searchMovie(enTitle, movie.year);
    
    if (!tmdbMovie) {
      // 检查是否是网络超时错误
      failCount++;
      continue;
    }

    if (!tmdbMovie.poster_path) {
      console.log(`  ⚠️  找到电影但没有海报`);
      failCount++;
      continue;
    }

    // 下载海报
    const posterUrl = `${POSTER_BASE_URL}${tmdbMovie.poster_path}`;
    const destPath = path.join(postersDir, `${slug}.jpg`);
    
    try {
      await downloadImage(posterUrl, destPath);
      console.log(`  ✓ 已下载: ${slug}.jpg`);
      posterMap[movie.title] = `/posters/${slug}.jpg`;
      successCount++;
    } catch (error) {
      console.log(`  ✗ 下载失败: ${error.message}`);
      failCount++;
    }

    // 延迟 500ms 避免请求过快
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n" + "=".repeat(60));
  console.log("下载完成统计:");
  console.log(`  成功: ${successCount}`);
  console.log(`  失败: ${failCount}`);
  console.log("=".repeat(60));

  // 无论下载结果如何，都生成完整的映射文件
  const posterMapPath = generatePosterMapFile();
  
  if (successCount === 0) {
    console.log("\n⚠️ 警告: 所有海报下载失败，可能是网络问题。");
    console.log("   映射文件已生成，但图片文件不存在。");
    console.log("   请在 VPN 环境下重新运行此脚本以下载图片。");
  }
}

main().catch(console.error);
