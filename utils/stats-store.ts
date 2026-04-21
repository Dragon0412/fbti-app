import fs from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");

export interface StatsData {
  totalCount: number;
  dailyCounts: Record<string, number>;
  personalityTypes: Record<string, number>;
  typeGenes: Record<string, { sum: number; count: number }>;
  hiddenAttributes: {
    alpha: Record<string, number>;
    beta: Record<string, number>;
    gamma: Record<string, number>;
  };
  geneShapes: Record<string, number>;
}

const defaultStats: StatsData = {
  totalCount: 0,
  dailyCounts: {},
  personalityTypes: {},
  typeGenes: {
    horror: { sum: 0, count: 0 },
    comedy: { sum: 0, count: 0 },
    scifi: { sum: 0, count: 0 },
    romance: { sum: 0, count: 0 },
    action: { sum: 0, count: 0 },
    drama: { sum: 0, count: 0 },
    animation: { sum: 0, count: 0 },
  },
  hiddenAttributes: {
    alpha: { common: 0, uncommon: 0, rare: 0, legendary: 0 },
    beta: { common: 0, uncommon: 0, rare: 0, legendary: 0 },
    gamma: { common: 0, uncommon: 0, rare: 0, legendary: 0 },
  },
  geneShapes: {},
};

// 内存缓存
let cache: StatsData | null = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5秒

// 互斥锁
let writeLock = false;

export function readStats(): StatsData {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  try {
    const raw = fs.readFileSync(STATS_FILE, "utf-8");
    cache = JSON.parse(raw) as StatsData;
    cacheTime = now;
    return cache;
  } catch {
    // 文件不存在或损坏，返回默认值
    return { ...defaultStats };
  }
}

export async function updateStats(submission: {
  type: string;
  delta: Record<string, number>;
  alpha: { rarity: string };
  beta: { rarity: string };
  gamma: { rarity: string };
  geneShape: string;
}): Promise<void> {
  // 简单互斥锁
  while (writeLock) {
    await new Promise((r) => setTimeout(r, 10));
  }
  writeLock = true;

  try {
    // 强制从磁盘读取最新数据
    let stats: StatsData;
    try {
      const raw = fs.readFileSync(STATS_FILE, "utf-8");
      stats = JSON.parse(raw) as StatsData;
    } catch {
      stats = JSON.parse(JSON.stringify(defaultStats));
    }

    const today = new Date().toISOString().slice(0, 10);

    // 更新总数
    stats.totalCount += 1;

    // 更新每日计数
    stats.dailyCounts[today] = (stats.dailyCounts[today] || 0) + 1;

    // 更新人格类型分布
    stats.personalityTypes[submission.type] = (stats.personalityTypes[submission.type] || 0) + 1;

    // 更新类型基因
    for (const [key, value] of Object.entries(submission.delta)) {
      if (!stats.typeGenes[key]) {
        stats.typeGenes[key] = { sum: 0, count: 0 };
      }
      stats.typeGenes[key].sum += value;
      stats.typeGenes[key].count += 1;
    }

    // 更新隐藏属性
    const attrMap = { alpha: submission.alpha, beta: submission.beta, gamma: submission.gamma };
    for (const [attr, data] of Object.entries(attrMap)) {
      const attrKey = attr as "alpha" | "beta" | "gamma";
      if (!stats.hiddenAttributes[attrKey]) {
        stats.hiddenAttributes[attrKey] = { common: 0, uncommon: 0, rare: 0, legendary: 0 };
      }
      stats.hiddenAttributes[attrKey][data.rarity] = (stats.hiddenAttributes[attrKey][data.rarity] || 0) + 1;
    }

    // 更新基因形状
    stats.geneShapes[submission.geneShape] = (stats.geneShapes[submission.geneShape] || 0) + 1;

    // 写入文件
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");

    // 更新缓存
    cache = stats;
    cacheTime = Date.now();
  } finally {
    writeLock = false;
  }
}
