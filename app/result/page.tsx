"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Result } from "@/utils/calculator";
import { personalityTypes } from "@/data/types";
import { questions } from "@/data/questions";
import html2canvas from "html2canvas";
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
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("fbti_result");
    if (!stored) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(stored));

    // 生成二维码
    const currentUrl = window.location.href;
    QRCode.toDataURL(currentUrl, {
      width: 120,
      margin: 1,
      color: {
        dark: "#d4a853", // 琥珀色
        light: "#0a0e1a", // 深色背景
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

  const handleShare = useCallback(async () => {
    setGenerating(true);
    setShowCard(true);
    // Wait for React to render the card in the DOM
    await new Promise((r) => setTimeout(r, 100));
    const el = document.getElementById("share-card-capture");
    if (!el) { setGenerating(false); return; }
    // Wait for fonts
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 500));

    try {
      const canvas = await html2canvas(el, {
        backgroundColor: "#0a0e1a",
        scale: 2,
        useCORS: true,
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      } as never);
      
      // 生成图片URL并显示预览
      const imageUrl = canvas.toDataURL("image/png");
      setGeneratedImage(imageUrl);
      setShowImagePreview(true);
    } catch (e) {
      console.error("Failed to generate share card:", e);
    } finally {
      setShowCard(false);
      setGenerating(false);
    }
  }, [result]);

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
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-lg mx-auto">
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
                  <span className="text-lg">{attr.name}</span>
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
              {result.topDirectors.map((d) => (
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
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">代表作品</p>
            <div className="flex flex-wrap gap-1.5">
              {result.topFilms.map((f) => (
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
              name="时间穿越者"
              rarity={result.hidden.alpha.rarity}
              label={result.hidden.alpha.label}
              score={result.hidden.alpha.score}
            />
            <HiddenAttrCard
              icon="β"
              name="形式感应器"
              rarity={result.hidden.beta.rarity}
              label={result.hidden.beta.label}
              score={result.hidden.beta.score}
            />
            <HiddenAttrCard
              icon="γ"
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
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-12">
          FBTI &mdash; Film Buff Type Indicator
        </p>
      </div>

      {/* Share Card — rendered off-screen for html2canvas */}
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
    </main>
  );
}

/** Share card rendered as HTML for html2canvas */
function ShareCardContent({ result, typeData, qrCodeUrl }: { result: Result; typeData: { name: string; tagline: string; socialLabel: string; description: string } | null; qrCodeUrl?: string }) {
  const amber = "#d4a853";
  const amberDim = "rgba(212, 168, 83, 0.7)";
  const bgCard = "#1a1f35";
  const white = "#ffffff";
  const gray300 = "#e2e6eb";
  const gray400 = "#b0b8c4";
  const gray500 = "#8b95a5";

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
    { key: "crime", label: "暗局", reveal: "犯罪", color: "#dc2626" },
    { key: "animation", label: "织梦", reveal: "动画", color: "#f472b6" },
    { key: "documentary", label: "拾真", reveal: "纪录片", color: "#10b981" },
  ];
  const delta = result.hidden.delta;
  const maxVal = Math.max(...Object.values(delta), 1);
  const values = genes.map((g) => delta[g.key] ?? 0);

  return (
    <div
      id="share-card-capture"
      style={{ width: 420, background: "#0a0e1a", padding: "40px 32px 32px", fontFamily: "'Noto Serif SC', 'Playfair Display', serif", color: "#d1d5db" }}
    >
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
                <span style={{ fontSize: 18 }}>{attr.name}</span>
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
            { icon: "α", name: "时间穿越者", rarity: result.hidden.alpha.rarity, label: result.hidden.alpha.label, gradient: "linear-gradient(135deg, #f9fafb 0%, #d1d5db 50%, #9ca3af 100%)" },
            { icon: "β", name: "形式感应器", rarity: result.hidden.beta.rarity, label: result.hidden.beta.label, gradient: "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%)" },
            { icon: "γ", name: "文化通行证", rarity: result.hidden.gamma.rarity, label: result.hidden.gamma.label, gradient: "linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #059669 100%)" },
          ].map((attr) => {
            const colors = hiddenAttrRarityColors[attr.rarity] ?? hiddenAttrRarityColors.common;
            return (
              <div key={attr.icon} style={{ backgroundColor: "#222845", borderRadius: 12, padding: "12px 8px", border: "1px solid rgba(107,114,128,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
                {/* 图标 - 顶部 */}
                <div style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  background: attr.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "8px 0"
                }}>{attr.icon}</div>
                
                {/* 名称 - 中间 */}
                <div style={{ fontSize: 11, color: gray300, textAlign: "center", lineHeight: "1.3", margin: "4px 0" }}>{attr.name}</div>
                
                {/* 标签 - 底部 */}
                <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 9999, fontSize: 12, lineHeight: "normal", backgroundColor: colors.bg, color: colors.text, fontWeight: 500 }}>
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
                  {/* 文字 - 直接使用内联样式,确保html2canvas能捕获 */}
                  <text
                    x={labelX}
                    y={labelY - 5}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fill={g.color}
                    fontSize="16"
                    fontFamily="'Noto Serif SC', serif"
                    fontWeight="600"
                  >
                    {g.label}
                  </text>
                  <text
                    x={labelX}
                    y={labelY + 12}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fill="rgba(212, 168, 83, 0.75)"
                    fontSize="14"
                    fontFamily="'Noto Sans SC', sans-serif"
                  >
                    {g.reveal} ({delta[g.key] ?? 0})
                  </text>
                </g>
              );
            })}
          </svg>
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
      <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid #1f2937" }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>FBTI &mdash; Film Buff Type Indicator</div>
        {/* 二维码 */}
        {qrCodeUrl && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <img src={qrCodeUrl} alt="分享二维码" style={{ width: 100, height: 100 }} />
            <div style={{ fontSize: 11, color: "#6b7280" }}>扫码发现你的电影人格</div>
          </div>
        )}
      </div>
    </div>
  );
}

function HiddenAttrCard({
  icon,
  name,
  rarity,
  label,
  score,
}: {
  icon: string;
  name: string;
  rarity: string;
  label: string;
  score: number;
}) {
  const colorClass = RARITY_COLORS[rarity] ?? RARITY_COLORS.common;
  const attrClass = icon === 'α' ? 'attr-alpha-icon' : icon === 'β' ? 'attr-beta-icon' : 'attr-gamma-icon';
  
  return (
    <div className="bg-[#222845] rounded-xl p-3 border border-gray-800 hover:border-gray-700 transition-all flex flex-col items-center justify-between h-full">
      {/* 图标区域 - 顶部 */}
      <div className={`text-3xl ${attrClass} flex items-center justify-center w-full`} style={{ minHeight: '48px', padding: '8px 0' }}>
        {icon}
      </div>
      
      {/* 名称 - 中间 */}
      <p className="text-xs text-gray-300 text-center leading-tight my-1">{name}</p>
      
      {/* 标签 - 底部 */}
      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
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
    { key: "crime", label: "暗局", reveal: "犯罪", desc: "偏好犯罪、黑帮、警匪、法庭类叙事", color: "#dc2626" },
    { key: "animation", label: "织梦", reveal: "动画", desc: "偏好动画、定格动画、手绘动画等形式", color: "#f472b6" },
    { key: "documentary", label: "拾真", reveal: "纪录片", desc: "偏好纪实、非虚构、真实事件改编类叙事", color: "#10b981" },
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
              {/* 文字 - 使用对应基因颜色和CSS类 */}
              <foreignObject x={labelX - 40} y={labelY - 15} width="80" height="30">
                <div xmlns="http://www.w3.org/1999/xhtml" className={`gene-label gene-${g.key}`} style={{ textAlign: "center", padding: "4px 8px", fontSize: "15px", fontWeight: isHovered ? "700" : "400" }}>
                  {g.label}
                </div>
              </foreignObject>
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
