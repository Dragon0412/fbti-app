"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Result } from "@/utils/calculator";
import { personalityTypes } from "@/data/types";
import { questions } from "@/data/questions";
import { domToPng } from "modern-screenshot";
import QRCode from "qrcode";
import Tooltip from "@/components/Tooltip";

const loadingMessages = [
  "正在分析你的观影DNA...",
  "正在匹配你的电影人格...",
  "你的影院即将开幕...",
];

const DIMENSION_LABELS: Record<string, {
  leftCode: string; left: string; leftEn: string; leftDesc: string;
  rightCode: string; right: string; rightEn: string; rightDesc: string;
  name: string;
}> = {
  EA: {
    leftCode: "E", left: "共情", leftEn: "Empathy", leftDesc: "用情感和直觉感受电影，被打动的瞬间就是意义",
    rightCode: "A", right: "解析", rightEn: "Analytical", rightDesc: "用理性和技法解读电影，理解「为什么好」是最大的快乐",
    name: "感知模式",
  },
  XS: {
    leftCode: "X", left: "拓荒", leftEn: "eXplorer", leftDesc: "跨越文化与类型的边界，在未知中寻找惊喜",
    rightCode: "S", right: "深耕", rightEn: "Specialist", rightDesc: "在一个领域越走越深，直到成为真正的专家",
    name: "探索方式",
  },
  PW: {
    leftCode: "P", left: "微光", leftEn: "Personal", leftDesc: "聚焦一个人的内心旅程，在私密的故事里找到共鸣",
    rightCode: "W", right: "广角", rightEn: "Wide-angle", rightDesc: "展开时代全景，在多线交织的大格局中感受震撼",
    name: "叙事引力",
  },
  LD: {
    leftCode: "L", left: "向阳", leftEn: "Light", leftDesc: "相信电影里应该有光，即使在苦难中也寻找温暖",
    rightCode: "D", right: "逐暗", rightEn: "Dark", rightDesc: "不回避黑暗与残酷，被击碎本身就是深刻的体验",
    name: "影调趋向",
  },
};

const RARITY_COLORS: Record<string, string> = {
  common: "bg-gray-600 text-gray-300",
  uncommon: "bg-green-800 text-green-300",
  rare: "bg-blue-800 text-blue-300",
  legendary: "bg-amber-800 text-amber-300",
};

const RARITY_ORDER = ["common", "uncommon", "rare", "legendary"];

// Hidden attribute thresholds & labels for progress bars
const HIDDEN_THRESHOLDS: Record<string, { thresholds: number[]; labels: string[] }> = {
  alpha: {
    thresholds: [2, 4, 6],
    labels: ["影院漫步者", "十年藏家", "影史漫游者", "时间旅人"],
  },
  beta: {
    thresholds: [3, 7, 12],
    labels: ["故事优先", "氛围捕手", "感官猎人", "影像魔法师"],
  },
  gamma: {
    thresholds: [2, 4, 6],
    labels: ["本土影迷", "邻国通", "世界公民", "无国界影人"],
  },
};

const RARITY_BAR_COLORS: Record<string, { bar: string; bg: string }> = {
  common: { bar: "bg-gray-500", bg: "bg-gray-800" },
  uncommon: { bar: "bg-green-500", bg: "bg-green-900/30" },
  rare: { bar: "bg-blue-500", bg: "bg-blue-900/30" },
  legendary: { bar: "bg-amber-500", bg: "bg-amber-900/30" },
};

function getNextLevel(attrKey: string, score: number): { nextLabel: string; nextRarity: string; needed: number } | null {
  const meta = HIDDEN_THRESHOLDS[attrKey];
  if (!meta) return null;
  const { thresholds, labels } = meta;
  const rarities = ["uncommon", "rare", "legendary"];
  for (let i = 0; i < thresholds.length; i++) {
    if (score <= thresholds[i]) {
      return { nextLabel: labels[i + 1], nextRarity: rarities[i], needed: thresholds[i] - score + 1 };
    }
  }
  return null; // already max
}

function getProgressFraction(attrKey: string, score: number): { current: number; max: number } {
  const meta = HIDDEN_THRESHOLDS[attrKey];
  if (!meta) return { current: 0, max: 1 };
  const maxThreshold = meta.thresholds[meta.thresholds.length - 1];
  return { current: Math.min(score, maxThreshold + 1), max: maxThreshold + 1 };
}

// Genre shape analysis
const GENRE_LABEL_MAP: Record<string, string> = {
  horror: "幽谷·恐怖", comedy: "浮生·喜剧", scifi: "异境·科幻",
  romance: "情澜·爱情", action: "烈风·动作",
  drama: "沉光·剧情", animation: "织梦·动画",
};

function analyzeGeneShape(delta: Record<string, number>): { tag: string; description: string } {
  const entries = Object.entries(delta).sort((a, b) => b[1] - a[1]);
  const scores = entries.map(([, v]) => v);
  const keys = entries.map(([k]) => k);

  if (scores.length === 0) return { tag: "全能影迷", description: "" };

  const max = scores[0];
  const min = scores[scores.length - 1];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + (b - avg) ** 2, 0) / scores.length;
  const sum = scores.reduce((a, b) => a + b, 0);
  const getName = (k: string) => GENRE_LABEL_MAP[k] || k;

  const top1 = scores[0];
  const top2 = scores.length > 1 ? scores[1] : 0;
  const top3 = scores.length > 2 ? scores[2] : 0;

  // 1. 基因待激活：几乎没有触发任何信号
  if (sum < 3 || max < 2) {
    return { tag: "基因待激活", description: "你的类型基因尚在沉睡中，也许需要更多观影探索来唤醒它们。" };
  }

  // 2. 全能影迷型：方差极小且平均分较高
  if (variance < 1.5 && avg >= 3) {
    return { tag: "全能影迷型", description: "你的类型基因分布均匀且充沛，几乎各种类型都能欣赏——这是最高级的电影修养表现。" };
  }

  // 3. 均衡探索型：方差小但分数不高
  if (variance < 1.5) {
    return { tag: "均衡探索型", description: "你的观影口味比较均衡，对各种类型都保持着开放的好奇心——继续探索，你的基因图谱会越来越丰富。" };
  }

  // 4. 极致专精型：某一类型远超其他且压倒性领先第二名
  if (top1 > avg * 2.5 && top1 > top2 * 2) {
    return { tag: "极致专精型", description: `你几乎把全部热情倾注在「${getName(keys[0])}」上——在这个领域，你是真正的行家里手。` };
  }

  // 5. 类型专家型：某一类型显著高于平均
  if (top1 > avg * 2) {
    return { tag: "类型专家型", description: `你在「${getName(keys[0])}」维度上有极强的偏好，是这个类型的深度爱好者。` };
  }

  // 6. 双核驱动型 / 反差萌型：两个类型并驾齐驱
  if (top2 > avg * 1.5 && top1 - top2 < 2) {
    const contrastPairs: [string, string][] = [
      ["horror", "romance"], ["horror", "comedy"], ["scifi", "romance"],
      ["action", "drama"], ["horror", "animation"], ["drama", "comedy"],
    ];
    const isContrast = contrastPairs.some(([a, b]) =>
      (keys[0] === a && keys[1] === b) || (keys[0] === b && keys[1] === a)
    );
    if (isContrast) {
      return { tag: "反差萌型", description: `「${getName(keys[0])}」与「${getName(keys[1])}」的组合出人意料——你的品味充满迷人的矛盾张力。` };
    }
    return { tag: "双核驱动型", description: `「${getName(keys[0])}」和「${getName(keys[1])}」是你的双引擎——这两个维度共同塑造了你的观影DNA。` };
  }

  // 7. 三足鼎立型：三个类型均衡突出
  if (top3 > avg * 1.3 && top1 - top3 < 2) {
    return { tag: "三足鼎立型", description: `「${getName(keys[0])}」「${getName(keys[1])}」「${getName(keys[2])}」三驾马车齐头并进，你的观影口味丰富而有层次。` };
  }

  // 8. 偏科影迷型：极端分化，爱的极爱，不爱的完全不碰
  if (max - min > 5 && variance > 4) {
    return { tag: "偏科影迷型", description: "你的类型偏好分化明显——热爱的极度热爱，无感的完全不碰，个性鲜明且立场坚定。" };
  }

  // 9. 混搭型：默认兜底
  return { tag: "混搭型", description: `你的类型偏好集中在「${getName(keys[0])}」和「${getName(keys[1])}」，这是一个有趣的品味组合。` };
}

const CODE_MEANINGS: Record<string, string> = {
  E: "Empathy · 共情",
  A: "Analytical · 解析",
  X: "eXplorer · 拓荒",
  S: "Specialist · 深耕",
  P: "Personal · 微光",
  W: "Wide-angle · 广角",
  L: "Light · 向阳",
  D: "Dark · 逐暗",
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showTicket, setShowTicket] = useState(true); // 显示票根遮罩
  const [isTearing, setIsTearing] = useState(false); // 撕票动画中
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [expandDirectors, setExpandDirectors] = useState(false);
  const [expandFilms, setExpandFilms] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const hasSubmittedStats = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("fbti_result");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setResult(parsed);

    // 自动提交统计数据（静默失败）
    if (!hasSubmittedStats.current) {
      hasSubmittedStats.current = true;
      const shape = analyzeGeneShape(parsed.hidden.delta);
      fetch("/api/stats/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          result: {
            type: parsed.type,
            delta: parsed.hidden.delta,
            alpha: { rarity: parsed.hidden.alpha.rarity },
            beta: { rarity: parsed.hidden.beta.rarity },
            gamma: { rarity: parsed.hidden.gamma.rarity },
            geneShape: shape.tag,
          },
        }),
      }).catch(() => {});
    }

    // 生成二维码
    const currentUrl = window.location.href;
    QRCode.toDataURL(currentUrl, {
      width: 120,
      margin: 1,
      color: {
        dark: "#1e3a8a", // 深蓝色
        light: "#ffffff", // 白色背景
      },
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
      });

    const interval = setInterval(() => {
      setLoadingMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setShowContent(true);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  const handleRetake = () => {
    sessionStorage.removeItem("fbti_result");
    router.push("/");
  };

  const typeData = result ? personalityTypes[result.type] : null;
  const geneShape = result ? analyzeGeneShape(result.hidden.delta) : null;

  const handleShare = useCallback(async () => {
    // 如果已有缓存的分享图片，直接显示
    if (generatedImage) {
      setShowImagePreview(true);
      return;
    }

    setGenerating(true);
    setShowCard(true);
    // 等待 React 渲染卡片到 DOM
    await new Promise((r) => setTimeout(r, 100));
    const el = document.getElementById("share-card-capture");
    if (!el) { setGenerating(false); return; }

    try {
      const dataUrl = await domToPng(el, {
        backgroundColor: "#0a0e1a",
        scale: 2,
        width: el.scrollWidth,
        height: el.scrollHeight,
      });
      setGeneratedImage(dataUrl);
      setShowImagePreview(true);
    } catch (e) {
      console.error("Failed to generate share card:", e);
    } finally {
      setShowCard(false);
      setGenerating(false);
    }
  }, [result, generatedImage]);

  // Loading state
  if (!showContent) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-8" />
        <p className="text-gray-400 text-lg animate-pulse">
          {loadingMessages[loadingMessage]}
        </p>
      </main>
    );
  }

  if (!result) return null;

  // Collect all attributes with rare or legendary rarity
  const highRarityAttrs = (() => {
    const attrs = [
      { name: "α", rarity: result.hidden.alpha.rarity, label: result.hidden.alpha.label },
      { name: "β", rarity: result.hidden.beta.rarity, label: result.hidden.beta.label },
      { name: "γ", rarity: result.hidden.gamma.rarity, label: result.hidden.gamma.label },
    ];
    return attrs.filter((a) => RARITY_ORDER.indexOf(a.rarity) >= 2);
  })();

  const hasHighRarity = highRarityAttrs.length > 0;

  return (
    <main className="min-h-screen bg-[#050810] relative overflow-hidden">
      {/* 影院射光效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[800px] bg-gradient-to-b from-amber-500/5 via-amber-500/2 to-transparent blur-3xl"></div>
        <div className="absolute top-20 left-1/4 w-[400px] h-[600px] bg-gradient-to-br from-blue-500/3 to-transparent blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-[400px] h-[600px] bg-gradient-to-bl from-purple-500/3 to-transparent blur-3xl"></div>
      </div>

      {/* 票根遮罩层 */}
      {showTicket && (
        <div className="fixed inset-0 z-[100] bg-[#0a0e1a] flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            {/* 票根容器 */}
            <div className="relative">
              {/* 票根主体 */}
              <div
                className={`relative bg-[#1a1f35] rounded-lg overflow-hidden transition-all duration-300 ${
                  isTearing ? "animate-ticket-tear" : ""
                }`}
                style={{
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* 票根顶部锯齿 - 三角形 */}
                <div className="flex justify-around px-4 pt-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#0a0e1a]"></div>
                  ))}
                </div>

                {/* 票根内容 */}
                <div className="p-8">
                  {/* 电影名称 */}
                  <div className="text-center mb-6">
                    <p className="text-xs text-amber-400/60 tracking-[0.3em] uppercase mb-2">
                      Film Buff Type Indicator
                    </p>
                    <h2 className="font-playfair text-5xl font-bold text-white mb-2">
                      FBTI
                    </h2>
                    <p className="text-lg text-gray-300">影迷类型指标</p>
                  </div>

                  {/* 分割线 */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#1a1f35] px-4 text-xs text-gray-500">
                        perforation line
                      </span>
                    </div>
                  </div>

                  {/* 结果展示区域 */}
                  <div className="text-center">
                    {!isTearing ? (
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-400 mb-4">
                            你的电影人格已经生成
                          </p>
                          <div className="font-playfair text-6xl font-bold text-amber-400 mb-2">
                            {result.type}
                          </div>
                          <p className="text-xl text-white mb-1">
                            {typeData?.name || "加载中..."}
                          </p>
                          {typeData?.tagline && (
                            <p className="text-sm text-gray-400 italic">
                              "{typeData.tagline}"
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setIsTearing(true);
                            setTimeout(() => {
                              setShowTicket(false);
                            }, 1500);
                          }}
                          className="px-8 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg
                                     hover:bg-amber-400 hover:scale-105 transition-all duration-300
                                     animate-fade-in"
                        >
                          撕开票根，查看完整结果
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="tear-line"></div>
                        <p className="text-gray-400 mt-4 animate-fade-in">
                          正在揭晓你的电影人格...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 票根底部锯齿 - 三角形 */}
                <div className="flex justify-around px-4 pb-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#0a0e1a]"></div>
                  ))}
                </div>
              </div>

              {/* 撕裂效果覆盖层 */}
              {isTearing && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* 撕裂线动画 */}
                  <div className="tear-line"></div>
                  
                  {/* 纸屑粒子 */}
                  <div className="paper-particle particle-1"></div>
                  <div className="paper-particle particle-2"></div>
                  <div className="paper-particle particle-3"></div>
                  <div className="paper-particle particle-4"></div>
                  <div className="paper-particle particle-5"></div>
                </div>
              )}
            </div>

            {/* 底部提示 */}
            {!isTearing && (
              <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in">
                ✨ 撕开票根，发现你的专属电影人格
              </p>
            )}
          </div>
        </div>
      )}

      {/* 影院氛围背景 */}
      <div className="relative min-h-screen bg-[#050810] overflow-hidden">
        {/* 射光效果 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[800px] bg-gradient-to-b from-amber-500/5 via-amber-500/2 to-transparent blur-3xl"></div>
          <div className="absolute top-20 left-1/4 w-[400px] h-[600px] bg-gradient-to-br from-blue-500/3 to-transparent blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-[400px] h-[600px] bg-gradient-to-bl from-purple-500/3 to-transparent blur-3xl"></div>
        </div>

        {/* 票根长条背景 */}
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-lg mx-auto bg-[#0a0e1a] rounded-lg overflow-hidden shadow-2xl">
            {/* 顶部锯齿 */}
            <div className="flex justify-around px-4 pt-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1a1f35]"></div>
              ))}
            </div>

            {/* 内容区 */}
            <div className="px-6 py-8">
        {/* 二维码 - 右上角 */}
        {qrCodeUrl && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-[#1a1f35] p-2 rounded-xl border border-gray-700/50 shadow-lg">
              <img src={qrCodeUrl} alt="分享二维码" className="w-20 h-20" />
              <p className="text-[10px] text-gray-500 text-center mt-1">扫码测试</p>
            </div>
          </div>
        )}

        {/* Type Code with Rarity Badge */}
        <div className="text-center mb-8">
          <div className="text-amber-400/60 text-sm tracking-[0.3em] uppercase mb-4">
            你的电影人格
          </div>
          <h1 className="font-playfair text-6xl md:text-7xl font-bold text-white mb-3 flex justify-center gap-1">
            {result.type.split("").map((char, index) => (
              <span
                key={index}
                className="relative inline-block cursor-pointer transition-colors duration-200 hover:text-[#d4a853] group"
              >
                {char}
                {/* Desktop tooltip */}
                <span className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <span className="block bg-[#1a1f35] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-[#d4a853] whitespace-nowrap">
                    {CODE_MEANINGS[char]}
                  </span>
                  {/* Arrow */}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1f35] border-l border-t border-gray-700 rotate-45"></span>
                </span>
              </span>
            ))}
          </h1>
          {/* Mobile: show meanings inline */}
          <p className="md:hidden text-xs text-gray-400 mb-3">
            {result.type.split("").map((char, index) => (
              <span key={index}>
                <span className="text-[#d4a853] font-medium">{char}</span>
                <span className="text-gray-500">{CODE_MEANINGS[char].replace(/ · /g, " ")}</span>
                {index < 3 && <span className="text-gray-600 mx-1">·</span>}
              </span>
            ))}
          </p>
          <h2 className="text-2xl text-amber-400 mb-2">{typeData?.name}</h2>
          <p className="text-gray-400 italic font-playfair text-base mb-4">
            &ldquo;{typeData?.tagline}&rdquo;
          </p>

          {hasHighRarity && (
            <div className="flex flex-wrap justify-center gap-2">
              {highRarityAttrs.map((attr) => (
                <div
                  key={attr.name}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                    attr.rarity === "legendary"
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-blue-500/50 bg-blue-500/10"
                  }`}
                >
                  <span className={`text-lg ${attr.name === 'α' ? 'attr-alpha-icon' : attr.name === 'β' ? 'attr-beta-icon' : 'attr-gamma-icon'}`}>{attr.name}</span>
                  <span
                    className={`text-sm font-medium ${
                      attr.rarity === "legendary"
                        ? "text-amber-300"
                        : "text-blue-300"
                    }`}
                  >
                    {attr.label}
                  </span>
                  {attr.rarity === "legendary" && (
                    <span className="text-xs text-amber-500/60">稀有</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dimension Bars */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
            维度分析
          </h3>
          <div className="space-y-4">
            {Object.entries(result.percentages).map(([pair, { winner, pct }]) => {
              const labels = DIMENSION_LABELS[pair];
              if (!labels) return null;
              const isLeft = winner === pair[0];
              const winnerDesc = isLeft ? labels.leftDesc : labels.rightDesc;
              return (
                <div key={pair}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={isLeft ? "text-white" : "text-gray-500"}>
                      <span className={isLeft ? "font-mono font-bold text-[#d4a853] mr-1" : "font-mono mr-1"}>
                        {labels.leftCode}
                      </span>
                      <span className="mr-1">{labels.left}</span>
                      <span className="text-[10px] text-gray-600 font-serif italic">{labels.leftEn}</span>
                    </span>
                    <span className={!isLeft ? "text-white" : "text-gray-500"}>
                      <span className="text-[10px] text-gray-600 font-serif italic mr-1">{labels.rightEn}</span>
                      <span className="mr-1">{labels.right}</span>
                      <span className={!isLeft ? "font-mono font-bold text-[#d4a853] ml-1" : "font-mono ml-1"}>
                        {labels.rightCode}
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isLeft ? "bg-amber-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${pct}%`,
                        float: isLeft ? "left" : "right",
                      }}
                    />
                  </div>
                  <div className="mt-1.5 text-xs">
                    <span className="text-gray-500">{labels.name}</span>
                    <span className="text-gray-600 mx-1">·</span>
                    <span className="text-gray-400">{winnerDesc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            {typeData?.description}
          </p>
        </div>

        {/* Directors & Films */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider">
              代表导演 & 作品
            </h3>
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m-9 7L21 3" /></svg>
              点击跳转 TMDB
            </span>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1.5">代表导演</p>
            <div className="flex flex-wrap gap-1.5">
              {(expandDirectors ? result.topDirectors : result.topDirectors.slice(0, 5)).map((d) => (
                <a
                  key={d}
                  href={`https://www.themoviedb.org/search/person?query=${encodeURIComponent(d)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#222845] rounded-full text-xs text-gray-300 cursor-pointer hover:text-amber-400 hover:underline transition-colors duration-200"
                >
                  {d}
                </a>
              ))}
              {result.topDirectors.length > 5 && (
                <button
                  onClick={() => setExpandDirectors(!expandDirectors)}
                  className="px-2.5 py-1 rounded-full text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                >
                  {expandDirectors ? "收起" : `+${result.topDirectors.length - 5} 更多`}
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">代表作品</p>
            <div className="flex flex-wrap gap-1.5">
              {(expandFilms ? result.topFilms : result.topFilms.slice(0, 5)).map((f) => (
                <a
                  key={f}
                  href={`https://www.themoviedb.org/search/movie?query=${encodeURIComponent(f)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#222845] rounded-full text-xs text-gray-300 cursor-pointer hover:text-amber-400 hover:underline transition-colors duration-200"
                >
                  {f}
                </a>
              ))}
              {result.topFilms.length > 5 && (
                <button
                  onClick={() => setExpandFilms(!expandFilms)}
                  className="px-2.5 py-1 rounded-full text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                >
                  {expandFilms ? "收起" : `+${result.topFilms.length - 5} 更多`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Social Label */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
          <p className="text-xs text-gray-500 mb-1">你的社交表现</p>
          <p className="text-white text-sm italic">
            &ldquo;{typeData?.socialLabel}&rdquo;
          </p>
        </div>

        {/* Hidden Attributes */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
            专属印记
          </h3>
          <div className="grid grid-cols-3 gap-3 items-stretch">
            <HiddenAttrCard
              icon="α"
              attrKey="alpha"
              name="影史沙漏"
              rarity={result.hidden.alpha.rarity}
              label={result.hidden.alpha.label}
              score={result.hidden.alpha.score}
            />
            <HiddenAttrCard
              icon="β"
              attrKey="beta"
              name="形式感应器"
              rarity={result.hidden.beta.rarity}
              label={result.hidden.beta.label}
              score={result.hidden.beta.score}
            />
            <HiddenAttrCard
              icon="γ"
              attrKey="gamma"
              name="文化通行证"
              rarity={result.hidden.gamma.rarity}
              label={result.hidden.gamma.label}
              score={result.hidden.gamma.score}
            />
          </div>
        </div>

        {/* Delta Type Gene Radar */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
            类型基因
          </h3>
          <DeltaRadarChart delta={result.hidden.delta} />
          {geneShape && (
            <p className="text-center text-xs text-gray-400 italic mt-3">
              <span className="text-amber-400/80 not-italic font-medium">{geneShape.tag}</span>
              <span className="mx-1">·</span>
              {geneShape.description}
            </p>
          )}
        </div>

        {/* Viewing Profile */}
        {result.profile && (
          <div className="bg-[#1a1f35] rounded-2xl p-6 mb-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              你的观影画像
            </h3>
            <div className="space-y-2 mb-4">
              <ProfileRow label="影厅" value={result.profile.hall} />
              <ProfileRow label="环境" value={result.profile.environment} />
              <ProfileRow label="社交" value={result.profile.social} />
              <ProfileRow label="风格" value={result.profile.style} />
            </div>
            <p className="text-gray-400 text-sm italic">
              &ldquo;{result.profile.description}&rdquo;
            </p>
          </div>
        )}

        {/* Film Sociologist Easter Egg */}
        {result.filmSociologist && (
          <div className="bg-[#1a1f35]/50 rounded-2xl p-6 mb-6 border border-gray-700/30">
            <p className="text-xs text-gray-500 mb-1">隐藏标签</p>
            <p className="text-gray-300 text-sm">
              你有一个隐藏标签：<span className="text-amber-400">银幕社会学家</span>
            </p>
          </div>
        )}

        {/* Skip warning */}
        {result.skipCount > questions.length * 0.25 && (
          <div className="bg-[#1a1f35]/50 rounded-2xl p-4 mb-6 border border-gray-700/30">
            <p className="text-gray-400 text-sm text-center">
              你跳过了 {result.skipCount} 题——多看几部电影再来测，结果会更准哦
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Tooltip 
            text="生成精美卡片，分享到社交媒体" 
            mobileHint="下载分享卡片"
          >
            <button
              onClick={handleShare}
              disabled={generating}
              className="w-full py-4 bg-[#1a1f35] text-amber-400 font-semibold text-lg rounded-lg
                         border border-amber-500/30 hover:bg-[#222845] hover:border-amber-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300"
            >
              {generating ? "生成中..." : "生成分享卡片"}
            </button>
          </Tooltip>
          
          <Tooltip 
            text="回到首页，重新选择测试类型" 
            mobileHint="返回首页"
          >
            <button
              onClick={handleRetake}
              className="w-full py-4 bg-[#1a1f35] text-gray-300 font-semibold text-lg rounded-lg
                         border border-gray-700 hover:bg-[#222845] hover:text-white hover:border-gray-600
                         transition-all duration-300"
            >
              返回首页
            </button>
          </Tooltip>
          
          <Tooltip 
            text="浏览 16 种电影人格类型详解" 
            mobileHint="查看所有类型"
          >
            <Link
              href="/encyclopedia"
              className="w-full py-4 bg-[#1a1f35] text-gray-300 font-semibold text-lg rounded-lg
                         border border-gray-700 hover:bg-[#222845] hover:text-white hover:border-gray-600
                         text-center transition-all duration-300"
            >
              查看图鉴
            </Link>
          </Tooltip>

          <Link
            href="/stats"
            className="w-full py-4 bg-[#1a1f35] text-gray-400 font-medium text-base rounded-lg
                       border border-gray-700/50 hover:bg-[#222845] hover:text-amber-400 hover:border-amber-500/30
                       text-center transition-all duration-300"
          >
            查看全站统计
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-12">
          FBTI &mdash; Film Buff Type Indicator
        </p>
            </div>

            {/* 底部锯齿 */}
            <div className="flex justify-around px-4 pb-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#1a1f35]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Card — rendered off-screen for modern-screenshot */}
      {showCard && (
        <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
          <ShareCardContent result={result} typeData={typeData} qrCodeUrl={qrCodeUrl} />
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && generatedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 提示文字 */}
            <div className="text-center mb-4 text-white">
              <p className="text-lg font-semibold mb-2">🎉 分享卡片已生成</p>
              <p className="text-sm text-gray-300">长按图片保存 / 右键保存图片</p>
            </div>
            
            {/* 图片 */}
            <img 
              src={generatedImage} 
              alt="FBTI 分享卡片"
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
              style={{ touchAction: 'none' }}
            />
            
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 撕票动画样式 */}
      <style>{`
        @keyframes ticket-tear {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) scale(1.02);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes tear-line {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes particle-fly {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) rotate(var(--rotate));
            opacity: 0;
          }
        }

        .animate-ticket-tear {
          animation: ticket-tear 1.5s ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .tear-line {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #d4a853,
            #fbbf24,
            #d4a853,
            transparent
          );
          box-shadow: 0 0 10px #d4a853;
          animation: tear-line 1.5s ease-in-out;
        }

        .paper-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #d4a853;
          opacity: 0;
        }

        .particle-1 {
          top: 50%;
          left: 20%;
          --tx: -50px;
          --ty: -80px;
          --rotate: 180deg;
          animation: particle-fly 1.5s ease-out 0.2s;
        }

        .particle-2 {
          top: 50%;
          left: 50%;
          --tx: 30px;
          --ty: -100px;
          --rotate: 270deg;
          animation: particle-fly 1.5s ease-out 0.3s;
        }

        .particle-3 {
          top: 50%;
          left: 80%;
          --tx: 60px;
          --ty: -70px;
          --rotate: 90deg;
          animation: particle-fly 1.5s ease-out 0.4s;
        }

        .particle-4 {
          top: 50%;
          left: 35%;
          --tx: -40px;
          --ty: -120px;
          --rotate: 45deg;
          animation: particle-fly 1.5s ease-out 0.5s;
        }

        .particle-5 {
          top: 50%;
          left: 65%;
          --tx: 50px;
          --ty: -90px;
          --rotate: 315deg;
          animation: particle-fly 1.5s ease-out 0.6s;
        }

        /* 专属印记图标样式 */
        .attr-alpha-icon {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.4));
        }

        .attr-beta-icon {
          background: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(196, 181, 253, 0.4));
        }

        .attr-gamma-icon {
          background: linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(110, 231, 183, 0.4));
        }
      `}</style>
    </main>
  );
}

/** Share card rendered as HTML for modern-screenshot */
function ShareCardContent({ result, typeData, qrCodeUrl }: { result: Result; typeData: { name: string; tagline: string; socialLabel: string; description: string } | null; qrCodeUrl?: string }) {
  const amber = "#d4a853";
  const amberDim = "rgba(212, 168, 83, 0.7)";
  const bgCard = "#1a1f35";
  const white = "#ffffff";
  const gray300 = "#e2e6eb";
  const gray400 = "#b0b8c4";
  const gray500 = "#8b95a5";

  const geneShape = analyzeGeneShape(result.hidden.delta);

  const RARITY_ORDER = ["common", "uncommon", "rare", "legendary"];

  // Collect all attributes with rare or legendary rarity for badge display
  const highRarityAttrs = (() => {
    const attrs = [
      { name: "α", rarity: result.hidden.alpha.rarity, label: result.hidden.alpha.label },
      { name: "β", rarity: result.hidden.beta.rarity, label: result.hidden.beta.label },
      { name: "γ", rarity: result.hidden.gamma.rarity, label: result.hidden.gamma.label },
    ];
    return attrs.filter((a) => RARITY_ORDER.indexOf(a.rarity) >= 2);
  })();

  const hasHighRarity = highRarityAttrs.length > 0;

  const rarityBadgeColor: Record<string, { bg: string; text: string; border: string }> = {
    common: { bg: "rgba(75,85,99,0.4)", text: "#d1d5db", border: "rgba(107,114,128,0.4)" },
    uncommon: { bg: "rgba(22,101,52,0.4)", text: "#86efac", border: "rgba(34,197,94,0.4)" },
    rare: { bg: "rgba(30,64,175,0.4)", text: "#93c5fd", border: "rgba(59,130,246,0.4)" },
    legendary: { bg: "rgba(146,64,14,0.4)", text: "#fde68a", border: "rgba(245,158,11,0.4)" },
  };

  const hiddenAttrRarityColors: Record<string, { bg: string; text: string }> = {
    common: { bg: "#4b5563", text: "#d1d5db" },
    uncommon: { bg: "#166534", text: "#86efac" },
    rare: { bg: "#1e40af", text: "#93c5fd" },
    legendary: { bg: "#92400e", text: "#fde68a" },
  };



  // Radar chart data
  const genes = [
    { key: "horror", label: "幽谷", reveal: "恐怖", color: "#a855f7" },
    { key: "comedy", label: "浮生", reveal: "喜剧", color: "#fbbf24" },
    { key: "scifi", label: "异境", reveal: "科幻", color: "#06b6d4" },
    { key: "romance", label: "情澜", reveal: "爱情", color: "#ff6b9d" },
    { key: "action", label: "烈风", reveal: "动作/冒险", color: "#ff4500" },
    { key: "drama", label: "沉光", reveal: "剧情", color: "#e8a87c" },
    { key: "animation", label: "织梦", reveal: "动画", color: "#4ade80" },
  ];
  const delta = result.hidden.delta;
  const maxVal = Math.max(...Object.values(delta), 1);
  const values = genes.map((g) => delta[g.key] ?? 0);

  return (
    <div
      id="share-card-capture"
      style={{ width: 420, background: "#0a0e1a", padding: "0", fontFamily: "'Noto Serif SC', 'Playfair Display', serif", color: "#d1d5db" }}
    >
      {/* 顶部锯齿 - 三角形 */}
      <div style={{ height: 12, background: "#0a0e1a", display: "flex", justifyContent: "space-around", padding: "0 16px" }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #1e243d" }}></div>
        ))}
      </div>

      {/* 内容区域 */}
      <div style={{ padding: "32px 28px 16px 28px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ color: amberDim, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
          你的电影人格
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 700, color: white, marginBottom: 8 }}>
          {result.type}
        </div>
        <div style={{ fontSize: 24, color: amber, marginBottom: 4 }}>{typeData?.name}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: gray500, marginBottom: 16 }}>
          &ldquo;{typeData?.tagline}&rdquo;
        </div>

        {/* Rarity Badges - show all high rarity attributes */}
        {hasHighRarity && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {highRarityAttrs.map((attr) => (
              <div
                key={attr.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 9999,
                  border: `1px solid ${attr.rarity === "legendary" ? "rgba(245,158,11,0.5)" : "rgba(59,130,246,0.5)"}`,
                  backgroundColor: attr.rarity === "legendary" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                }}
              >
                <span style={{ fontSize: 18, color: attr.name === 'α' ? '#ee5a6f' : attr.name === 'β' ? '#a78bfa' : '#34d399' }}>{attr.name}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: attr.rarity === "legendary" ? "#fde68a" : "#93c5fd",
                  }}
                >
                  {attr.label}
                </span>
                {attr.rarity === "legendary" && (
                  <span style={{ fontSize: 12, color: "rgba(245,158,11,0.6)" }}>稀有</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dimension Bars */}
      <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: bgCard }}>
        <div style={{ fontSize: 13, color: gray400, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
          维度分析
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(result.percentages).map(([pair, { winner, pct }]) => {
            const labels = DIMENSION_LABELS[pair];
            if (!labels) return null;
            const isLeft = winner === pair[0];
            const winnerDesc = isLeft ? labels.leftDesc : labels.rightDesc;
            return (
              <div key={pair}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: isLeft ? white : gray500 }}>
                    <span style={{ fontFamily: "monospace", fontWeight: "bold", color: isLeft ? amber : gray500, marginRight: 4 }}>
                      {labels.leftCode}
                    </span>
                    <span style={{ marginRight: 4 }}>{labels.left}</span>
                    <span style={{ fontSize: 11, color: gray500, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>{labels.leftEn}</span>
                  </span>
                  <span style={{ color: isLeft ? gray500 : white }}>
                    <span style={{ fontSize: 11, color: gray500, fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginRight: 4 }}>{labels.rightEn}</span>
                    <span style={{ marginRight: 4 }}>{labels.right}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: "bold", color: isLeft ? gray500 : amber, marginLeft: 4 }}>
                      {labels.rightCode}
                    </span>
                  </span>
                </div>
                <div style={{ height: 10, backgroundColor: "#374151", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, float: isLeft ? "left" : "right", backgroundColor: isLeft ? amber : "#3b82f6", borderRadius: 5 }} />
                </div>
                <div style={{ marginTop: 6, fontSize: 12 }}>
                  <span style={{ color: gray500 }}>{labels.name}</span>
                  <span style={{ color: "#4b5563", margin: "0 4px" }}>·</span>
                  <span style={{ color: gray400 }}>{winnerDesc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      {typeData?.description && (
        <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: bgCard }}>
          <p style={{ fontSize: 15, color: gray300, lineHeight: 1.7, margin: 0 }}>
            {typeData.description}
          </p>
        </div>
      )}

      {/* Directors & Films */}
      <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: bgCard }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: gray400, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            代表导演 & 作品
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: gray500, marginBottom: 6 }}>代表导演</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {result.topDirectors.map((d) => (
              <a key={d} href={`https://www.themoviedb.org/search/person?query=${encodeURIComponent(d)}`} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", borderRadius: 9999, fontSize: 13, backgroundColor: "#222845", color: gray300, cursor: "pointer", textDecoration: "none" }}>{d}</a>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: gray500, marginBottom: 6 }}>代表作品</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {result.topFilms.map((f) => (
              <a key={f} href={`https://www.themoviedb.org/search/movie?query=${encodeURIComponent(f)}`} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", borderRadius: 9999, fontSize: 13, backgroundColor: "#222845", color: gray300, cursor: "pointer", textDecoration: "none" }}>{f}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Social Label */}
      <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: bgCard }}>
        <div style={{ fontSize: 13, color: gray500, marginBottom: 4 }}>你的社交表现</div>
        <p style={{ color: white, fontSize: 15, fontStyle: "italic", margin: 0 }}>&ldquo;{typeData?.socialLabel}&rdquo;</p>
      </div>

      {/* Hidden Attributes */}
      <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, backgroundColor: bgCard }}>
        <div style={{ fontSize: 13, color: gray400, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
          专属印记
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { icon: "α", name: "影史沙漏", rarity: result.hidden.alpha.rarity, label: result.hidden.alpha.label },
            { icon: "β", name: "形式感应器", rarity: result.hidden.beta.rarity, label: result.hidden.beta.label },
            { icon: "γ", name: "文化通行证", rarity: result.hidden.gamma.rarity, label: result.hidden.gamma.label },
          ].map((attr) => {
            // 纯色，确保截图正确渲染（渐变文字不被支持）
            const iconColor = attr.icon === 'α'
              ? '#ee5a6f'
              : attr.icon === 'β'
              ? '#a78bfa'
              : '#34d399';
            const iconShadow = attr.icon === 'α'
              ? 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.5))'
              : attr.icon === 'β'
              ? 'drop-shadow(0 0 8px rgba(196, 181, 253, 0.5))'
              : 'drop-shadow(0 0 8px rgba(110, 231, 183, 0.5))';
            const rarityColor = hiddenAttrRarityColors[attr.rarity] ?? hiddenAttrRarityColors.common;
            
            return (
              <div key={attr.icon} style={{ backgroundColor: "#222845", borderRadius: 16, padding: "12px", border: "1px solid #1f2937", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
                {/* 图标 - 顶部 */}
                <div style={{ 
                  fontSize: 30, 
                  fontWeight: 400,
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "8px 0"
                }}>
                  <span style={{ 
                    fontSize: 'inherit', 
                    fontWeight: 'inherit',
                    color: iconColor,
                    filter: iconShadow
                  }}>{attr.icon}</span>
                </div>
                
                {/* 名称 - 中间 */}
                <div style={{ fontSize: 12, color: gray300, textAlign: "center", lineHeight: "1.25", margin: "4px 0" }}>{attr.name}</div>
                
                {/* 标签 - 底部胶囊色块 */}
                <span style={{ 
                  display: "inline-block",
                  padding: "0 10px",
                  borderRadius: 9999,
                  fontSize: 12,
                  lineHeight: "22px",
                  height: 22,
                  fontWeight: 500,
                  textAlign: "center" as const,
                  backgroundColor: rarityColor.bg,
                  color: rarityColor.text,
                  whiteSpace: "nowrap" as const
                }}>
                  {attr.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delta Type Gene Radar */}
      <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: bgCard }}>
        <div style={{ fontSize: 13, color: gray400, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
          类型基因
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg viewBox="-80 -30 460 360" style={{ width: 400, height: 312 }}>
            {[0.25, 0.5, 0.75, 1].map((scale, i) => (
              <circle key={i} cx="150" cy="150" r={80 * scale} fill="none" stroke="#2a3050" strokeWidth="0.5" />
            ))}
            {genes.map((_, i) => {
              const angle = (Math.PI * 2 * i) / genes.length - Math.PI / 2;
              return (
                <line key={i} x1="150" y1="150" x2={150 + 80 * Math.cos(angle)} y2={150 + 80 * Math.sin(angle)} stroke="#2a3050" strokeWidth="0.5" />
              );
            })}
            <polygon
              points={genes.map((_, i) => {
                const angle = (Math.PI * 2 * i) / genes.length - Math.PI / 2;
                const r = (values[i] / maxVal) * 80;
                return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
              }).join(" ")}
              fill="rgba(212, 168, 83, 0.15)"
              stroke={amber}
              strokeWidth="1.5"
            />
            {genes.map((g, i) => {
              const angle = (Math.PI * 2 * i) / genes.length - Math.PI / 2;
              const r = (values[i] / maxVal) * 80;
              const dotX = 150 + r * Math.cos(angle);
              const dotY = 150 + r * Math.sin(angle);
              const labelX = 150 + 100 * Math.cos(angle);
              const labelY = 150 + 100 * Math.sin(angle);
              let anchor: "start" | "middle" | "end";
              const cos = Math.cos(angle);
              if (Math.abs(cos) < 0.15) {
                anchor = "middle";
              } else if (cos > 0) {
                anchor = "start";
              } else {
                anchor = "end";
              }
              return (
                <g key={i}>
                  {/* 点 - 琥珀色 */}
                  <circle cx={dotX} cy={dotY} r="4" fill="#d4a853" />
                  {/* 标签 - 单行，使用基因对应颜色 */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fill={g.color}
                    fontSize="15"
                    fontFamily="'Noto Serif SC', serif"
                    fontWeight="600"
                  >
                    {g.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* Gene shape tag */}
        <div style={{ textAlign: "center", fontSize: 13, color: gray500, fontStyle: "italic", marginTop: 8, paddingBottom: 4 }}>
          <span style={{ color: amber, fontStyle: "normal", fontWeight: 600 }}>{geneShape.tag}</span>
          <span style={{ margin: "0 4px" }}>·</span>
          {geneShape.description}
        </div>
      </div>

      {/* Viewing Profile */}
      {result.profile && (
        <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: bgCard }}>
          <div style={{ fontSize: 13, color: gray400, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
            你的观影画像
          </div>
          <div style={{ marginBottom: 16 }}>
            {[
              { label: "影厅", value: result.profile.hall },
              { label: "环境", value: result.profile.environment },
              { label: "社交", value: result.profile.social },
              { label: "风格", value: result.profile.style },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: gray500, fontSize: 14, width: 36 }}>{row.label}</span>
                <span style={{ color: white, fontSize: 14, fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <p style={{ color: gray400, fontSize: 15, fontStyle: "italic", margin: 0 }}>&ldquo;{result.profile.description}&rdquo;</p>
        </div>
      )}

      {/* Film Sociologist Easter Egg */}
      {result.filmSociologist && (
        <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, backgroundColor: "rgba(26,31,53,0.5)", border: "1px solid rgba(55,65,81,0.3)" }}>
          <div style={{ fontSize: 13, color: gray500, marginBottom: 4 }}>隐藏标签</div>
          <p style={{ color: gray300, fontSize: 15, margin: 0 }}>
            你有一个隐藏标签：<span style={{ color: amber }}>银幕社会学家</span>
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 24, borderTop: "1px solid #1f2937" }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>FBTI &mdash; Film Buff Type Indicator</div>
        {/* 二维码 */}
        {qrCodeUrl && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <img src={qrCodeUrl} alt="分享二维码" style={{ width: 100, height: 100 }} />
            <div style={{ fontSize: 11, color: "#6b7280" }}>扫码发现你的电影人格</div>
          </div>
        )}
      </div>

      {/* 底部锯齿 - 三角形 */}
      <div style={{ height: 12, background: "#0a0e1a", display: "flex", justifyContent: "space-around", padding: "0 16px" }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "8px solid #1e243d" }}></div>
        ))}
      </div>
    </div>
    </div>
  );
}

function HiddenAttrCard({
  icon,
  attrKey,
  name,
  rarity,
  label,
  score,
}: {
  icon: string;
  attrKey: string;
  name: string;
  rarity: string;
  label: string;
  score: number;
}) {
  const colorClass = RARITY_COLORS[rarity] ?? RARITY_COLORS.common;
  const attrClass = icon === 'α' ? 'attr-alpha-icon' : icon === 'β' ? 'attr-beta-icon' : 'attr-gamma-icon';
  const barColors = RARITY_BAR_COLORS[rarity] ?? RARITY_BAR_COLORS.common;
  const progress = getProgressFraction(attrKey, score);
  const pct = Math.round((progress.current / progress.max) * 100);
  const next = getNextLevel(attrKey, score);
  const RARITY_LABEL_CN: Record<string, string> = { uncommon: "罕见", rare: "稀有", legendary: "传说" };

  return (
    <div className="bg-[#222845] rounded-xl p-3 border border-gray-800 hover:border-gray-700 transition-all flex flex-col items-center justify-between h-full">
      {/* 图标区域 - 顶部 */}
      <div className={`text-2xl ${attrClass} flex items-center justify-center w-full`} style={{ minHeight: '36px', padding: '4px 0' }}>
        {icon}
      </div>
      
      {/* 名称 */}
      <p className="text-[10px] text-gray-300 text-center leading-tight my-0.5">{name}</p>
      
      {/* 标签 - 胶团色块 */}
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${colorClass}`}>
        {label}
      </span>

      {/* 进度条 */}
      <div className="w-full mt-2">
        <div className={`h-1.5 rounded-full overflow-hidden ${barColors.bg}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColors.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[9px] text-gray-500 text-center mt-0.5">
          {progress.current}/{progress.max}
        </p>
      </div>

      {/* 下一等级提示 */}
      {next && (
        <p className="text-[8px] text-gray-600 text-center mt-0.5 leading-tight">
          下一级: {next.nextLabel}
          <span className="text-gray-500"> ({RARITY_LABEL_CN[next.nextRarity] || next.nextRarity})</span>
          <br />还需 +{next.needed}
        </p>
      )}
      {!next && (
        <p className="text-[8px] text-amber-400/60 text-center mt-0.5">★ 已满级</p>
      )}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 w-8 shrink-0">{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}

function DeltaRadarChart({ delta }: { delta: Record<string, number> }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const genes = [
    { key: "horror", label: "幽谷", reveal: "恐怖", desc: "偏好惊悚、悬疑、心理恐惧类叙事", color: "#a855f7" },
    { key: "comedy", label: "浮生", reveal: "喜剧", desc: "偏好幽默、荒诞、轻松解压的喜剧类型", color: "#fbbf24" },
    { key: "scifi", label: "异境", reveal: "科幻", desc: "偏好未来主义、太空探索、科技伦理类叙事", color: "#06b6d4" },
    { key: "romance", label: "情澜", reveal: "爱情", desc: "偏好爱情、浪漫关系类叙事", color: "#ff6b9d" },
    { key: "action", label: "烈风", reveal: "动作/冒险", desc: "偏好动作、冒险、追逐、战斗类叙事", color: "#ff4500" },
    { key: "drama", label: "沉光", reveal: "剧情", desc: "偏好人物深度、角色发展、演技、情感弧线类叙事", color: "#e8a87c" },
    { key: "animation", label: "织梦", reveal: "动画", desc: "偏好动画艺术、二次元、奇幻世界构建类作品", color: "#4ade80" },
  ];

  const maxVal = Math.max(...Object.values(delta), 1);
  const values = genes.map((g) => delta[g.key] ?? 0);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 300 300" className="w-72 h-72">
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle key={i} cx="150" cy="150" r={90 * scale} fill="none" stroke="#2a3050" strokeWidth="0.5" />
        ))}
        {/* Axis lines */}
        {genes.map((_, i) => {
          const angle = (Math.PI * 2 * i) / genes.length - Math.PI / 2;
          return (
            <line key={i} x1="150" y1="150" x2={150 + 90 * Math.cos(angle)} y2={150 + 90 * Math.sin(angle)} stroke="#2a3050" strokeWidth="0.5" />
          );
        })}
        {/* Data polygon */}
        <polygon
          points={genes.map((_, i) => {
            const angle = (Math.PI * 2 * i) / genes.length - Math.PI / 2;
            const r = (values[i] / maxVal) * 90;
            return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
          }).join(" ")}
          fill="rgba(212, 168, 83, 0.15)"
          stroke="#d4a853"
          strokeWidth="1.5"
        />
        {/* Dots + labels */}
        {genes.map((g, i) => {
          const angle = (Math.PI * 2 * i) / genes.length - Math.PI / 2;
          const r = (values[i] / maxVal) * 90;
          const dotX = 150 + r * Math.cos(angle);
          const dotY = 150 + r * Math.sin(angle);
          const labelX = 150 + 115 * Math.cos(angle);
          const labelY = 150 + 115 * Math.sin(angle);
          let anchor: "start" | "middle" | "end";
          const cos = Math.cos(angle);
          if (Math.abs(cos) < 0.15) {
            anchor = "middle";
          } else if (cos > 0) {
            anchor = "start";
          } else {
            anchor = "end";
          }
          const isHovered = hovered === i;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "help" }}
            >
              {/* 透明触摸区域 */}
              <circle cx={dotX} cy={dotY} r="20" fill="transparent" />
              {/* 点 - 使用默认琥珀色 */}
              <circle cx={dotX} cy={dotY} r={isHovered ? 7 : 5} fill="#d4a853" style={{ transition: "r 0.15s ease" }} />
              {isHovered && <circle cx={dotX} cy={dotY} r="12" fill="none" stroke="#d4a853" strokeWidth="1.5" opacity={0.6} />}
              {isHovered && <circle cx={dotX} cy={dotY} r="15" fill="#d4a853" opacity={0.2} />}
              {/* 文字 - 使用对应基因颜色 */}
              <text
                x={labelX}
                y={labelY}
                textAnchor={anchor}
                dominantBaseline="central"
                fill={g.color}
                fontSize={isHovered ? "17" : "15"}
                fontFamily="'Noto Serif SC', serif"
                fontWeight={isHovered ? "700" : "400"}
                style={{ transition: "font-size 0.15s ease" }}
              >
                {g.label}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Tooltip — rendered as HTML below the SVG, no overlap */}
      <div
        className="text-center transition-all duration-200 ease-out"
        style={{
          minHeight: 44,
          opacity: hovered !== null ? 1 : 0,
          transform: hovered !== null ? "translateY(0)" : "translateY(-4px)",
        }}
      >
        {hovered !== null && (
          <div className="inline-block px-4 py-2 rounded-lg border bg-[#1a1f35]/95" style={{ borderColor: `${genes[hovered].color}40`, boxShadow: `0 0 20px ${genes[hovered].color}20` }}>
            <span className="font-semibold text-sm" style={{ color: genes[hovered].color }}>{genes[hovered].label} → {genes[hovered].reveal}</span>
            <span className="text-gray-400 text-xs ml-1.5">({delta[genes[hovered].key] ?? 0})</span>
            <p className="text-gray-300 text-xs mt-0.5 mb-0">{genes[hovered].desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
