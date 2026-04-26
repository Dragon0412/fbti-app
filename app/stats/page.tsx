"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { personalityTypes } from "@/data/types";

interface StatsData {
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

const GENE_COLORS: Record<string, { color: string; label: string }> = {
  horror: { color: "#a855f7", label: "幽谷·恐怖" },
  comedy: { color: "#fbbf24", label: "浮生·喜剧" },
  scifi: { color: "#06b6d4", label: "异境·科幻" },
  romance: { color: "#ff6b9d", label: "情澜·爱情" },
  action: { color: "#ff4500", label: "烈风·动作" },
  drama: { color: "#e8a87c", label: "沉光·剧情" },
  animation: { color: "#4ade80", label: "织梦·动画" },
};

const RARITY_COLORS: Record<string, { color: string; label: string }> = {
  common: { color: "#6b7280", label: "普通" },
  uncommon: { color: "#3b82f6", label: "罕见" },
  rare: { color: "#a855f7", label: "稀有" },
  legendary: { color: "#f59e0b", label: "传说" },
};

const HIDDEN_ATTR_NAMES: Record<string, { symbol: string; name: string }> = {
  alpha: { symbol: "α", name: "影史沙漏" },
  beta: { symbol: "β", name: "形式感应器" },
  gamma: { symbol: "γ", name: "文化通行证" },
};

const SHAPE_LIST = [
  "全能影迷型", "均衡探索型", "极致专精型", "类型专家型", "反差萌型",
  "双核驱动型", "三足鼎立型", "偏科影迷型", "混搭型", "基因待激活",
];

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonPage />;
  if (error) return (
    <main className="min-h-screen bg-[#0f1225] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-4">加载失败: {error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#1a1f35] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
          重试
        </button>
      </div>
    </main>
  );
  if (!data || data.totalCount === 0) return <EmptyState />;

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCount = data.dailyCounts[todayKey] ?? 0;

  // Personality type helpers
  const typeEntries = Object.entries(data.personalityTypes).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = typeEntries.length > 0 ? typeEntries[0][1] : 1;
  const totalTypes = typeEntries.reduce((s, [, v]) => s + v, 0) || 1;
  const rarestTypes = [...typeEntries].sort((a, b) => a[1] - b[1]).slice(0, 3);

  // Type gene helpers
  const geneEntries = Object.entries(data.typeGenes).map(([key, { sum, count }]) => ({
    key,
    avg: count > 0 ? sum / count : 0,
    ...GENE_COLORS[key],
  })).sort((a, b) => b.avg - a.avg);
  const maxGeneAvg = geneEntries.length > 0 ? geneEntries[0].avg : 1;

  const highestGene = geneEntries[0];
  const lowestGene = geneEntries[geneEntries.length - 1];

  // Shape helpers
  const shapeEntries = SHAPE_LIST.map((name) => ({
    name,
    count: data.geneShapes[name] ?? 0,
  })).sort((a, b) => b.count - a.count);
  const maxShapeCount = shapeEntries.length > 0 ? Math.max(...shapeEntries.map((s) => s.count), 1) : 1;
  const totalShapes = shapeEntries.reduce((s, e) => s + e.count, 0) || 1;

  // Bar color based on first letter
  const getBarGradient = (code: string) => {
    const c0 = code[0];
    const c1 = code[1];
    const map: Record<string, string> = {
      E: "#f59e0b", A: "#3b82f6",
      X: "#06b6d4", S: "#8b5cf6",
      P: "#ec4899", W: "#10b981",
      L: "#fbbf24", D: "#6366f1",
    };
    return `linear-gradient(to top, ${map[c0] || "#f59e0b"}, ${map[c1] || "#3b82f6"})`;
  };

  return (
    <main className="min-h-screen bg-[#0f1225] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/3 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* 1. Page Title */}
        <header className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">全站统计</h1>
          <p className="text-gray-400">
            已有{" "}
            <span className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              {data.totalCount.toLocaleString()}
            </span>{" "}
            位影迷完成测试
          </p>
        </header>

        {/* 2. Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Total count card */}
          <div className="bg-[#1a1f35] rounded-2xl p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">总参与人数</h3>
            <p className="text-4xl font-bold text-white mb-1">{data.totalCount.toLocaleString()}</p>
            <p className="text-sm text-green-400">今日新增 +{todayCount}</p>
          </div>
          {/* Rarest types card */}
          <div className="bg-[#1a1f35] rounded-2xl p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">最稀有人格 TOP3</h3>
            <div className="space-y-2">
              {rarestTypes.map(([code, count], i) => (
                <div key={code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-5">{i + 1}.</span>
                    <span className="font-mono font-bold text-amber-400">{code}</span>
                    <span className="text-xs text-gray-400">{personalityTypes[code]?.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{count} 人</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Personality Distribution */}
        <section className="bg-[#1a1f35] rounded-2xl p-6 mb-10">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-6">人格类型分布</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-end gap-2 min-w-[640px]" style={{ height: 220 }}>
              {typeEntries.map(([code, count]) => {
                const pct = maxTypeCount > 0 ? (count / maxTypeCount) * 100 : 0;
                const percent = ((count / totalTypes) * 100).toFixed(1);
                const isMax = code === typeEntries[0][0];
                const isMin = code === typeEntries[typeEntries.length - 1][0];
                return (
                  <div key={code} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-[#0f1225] border border-gray-700 rounded-lg px-3 py-1.5 text-center whitespace-nowrap">
                        <p className="text-xs text-white font-semibold">{count} 人</p>
                        <p className="text-xs text-gray-400">{percent}%</p>
                      </div>
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${Math.max(pct, 3)}%`,
                        background: getBarGradient(code),
                        minHeight: 4,
                      }}
                      title={`${code}: ${count}人 (${percent}%)`}
                    />
                    {/* Label */}
                    <span className={`text-[10px] mt-1.5 font-mono ${isMax ? "text-amber-400 font-bold" : isMin ? "text-red-400 font-bold" : "text-gray-500"}`}>
                      {code}
                    </span>
                    <span className={`text-[8px] ${isMax ? "text-amber-400/80" : isMin ? "text-red-400/80" : "text-gray-600"}`}>
                      {personalityTypes[code]?.name}
                    </span>
                    {isMax && <span className="text-[8px] text-amber-400/70">最多</span>}
                    {isMin && <span className="text-[8px] text-red-400/70">最少</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Type Gene Heatmap */}
        <section className="bg-[#1a1f35] rounded-2xl p-6 mb-10">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-6">类型基因偏好</h3>
          <div className="space-y-4">
            {geneEntries.map((gene) => {
              const pct = maxGeneAvg > 0 ? (gene.avg / maxGeneAvg) * 100 : 0;
              const isHighest = gene.key === highestGene?.key;
              const isLowest = gene.key === lowestGene?.key;
              return (
                <div key={gene.key} className="flex items-center gap-3">
                  <span className={`text-sm w-24 shrink-0 ${isHighest ? "text-white font-semibold" : isLowest ? "text-gray-500" : "text-gray-300"}`}>
                    {gene.label}
                    {isHighest && <span className="text-[10px] text-amber-400 ml-1">最高</span>}
                    {isLowest && <span className="text-[10px] text-gray-500 ml-1">最低</span>}
                  </span>
                  <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(pct, 2)}%`,
                        backgroundColor: gene.color,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right shrink-0">
                    {gene.avg.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Hidden Attributes Rarity */}
        <section className="bg-[#1a1f35] rounded-2xl p-6 mb-10">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-6">专属印记稀有度</h3>
          <div className="space-y-6">
            {(["alpha", "beta", "gamma"] as const).map((attrKey) => {
              const attrData = data.hiddenAttributes[attrKey];
              const meta = HIDDEN_ATTR_NAMES[attrKey];
              const total = Object.values(attrData).reduce((s, v) => s + v, 0) || 1;
              return (
                <div key={attrKey}>
                  <p className="text-sm text-gray-300 mb-2">
                    <span className="text-lg mr-1">{meta.symbol}</span>
                    {meta.name}
                  </p>
                  {/* Stacked bar */}
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    {(["common", "uncommon", "rare", "legendary"] as const).map((rarity) => {
                      const count = attrData[rarity] ?? 0;
                      const pct = (count / total) * 100;
                      if (pct < 0.5) return null;
                      const isLegendary = rarity === "legendary";
                      return (
                        <div
                          key={rarity}
                          className={`flex items-center justify-center text-[10px] font-medium transition-all relative ${isLegendary ? "z-10" : ""}`}
                          style={{
                            width: `${pct}%`,
                            backgroundColor: RARITY_COLORS[rarity].color,
                            boxShadow: isLegendary ? `0 0 12px ${RARITY_COLORS[rarity].color}, 0 0 24px ${RARITY_COLORS[rarity].color}40` : undefined,
                            border: isLegendary ? "2px solid #fbbf24" : undefined,
                          }}
                          title={`${RARITY_COLORS[rarity].label}: ${count}人 (${pct.toFixed(1)}%)`}
                        >
                          {pct > 8 && (
                            <span className="text-white drop-shadow-md">{pct.toFixed(0)}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {(["common", "uncommon", "rare", "legendary"] as const).map((rarity) => {
                      const count = attrData[rarity] ?? 0;
                      if (count === 0) return null;
                      return (
                        <div key={rarity} className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: RARITY_COLORS[rarity].color }} />
                          <span className="text-[10px] text-gray-500">{RARITY_COLORS[rarity].label} {count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Gene Shape Distribution */}
        <section className="bg-[#1a1f35] rounded-2xl p-6 mb-10">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-6">基因形状分布</h3>
          <div className="space-y-3">
            {shapeEntries.map((shape) => {
              const pct = maxShapeCount > 0 ? (shape.count / maxShapeCount) * 100 : 0;
              const percent = ((shape.count / totalShapes) * 100).toFixed(1);
              return (
                <div key={shape.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-28 shrink-0 truncate">{shape.name}</span>
                  <div className="flex-1 h-5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-400 transition-all duration-700"
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-20 text-right shrink-0">
                    {shape.count}人 ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Footer */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="px-8 py-4 bg-[#1a1f35] text-gray-300 font-semibold text-lg rounded-lg border border-gray-700 hover:bg-[#222845] hover:text-white hover:border-gray-600 text-center transition-all duration-300"
          >
            返回首页
          </Link>
          <Link
            href="/encyclopedia"
            className="px-8 py-4 bg-[#1a1f35] text-amber-400 font-semibold text-lg rounded-lg border border-amber-500/30 hover:bg-[#222845] hover:border-amber-500/50 text-center transition-all duration-300"
          >
            查看图鉴
          </Link>
        </div>

        <footer className="text-center pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600">
            FBTI &mdash; Film Buff Type Indicator
          </p>
        </footer>
      </div>
    </main>
  );
}

function SkeletonPage() {
  return (
    <main className="min-h-screen bg-[#0f1225] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Title skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 w-32 bg-gray-800 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-12 w-64 bg-gray-800 rounded-lg mx-auto animate-pulse" />
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-[#1a1f35] rounded-2xl p-6 h-32 animate-pulse" />
          <div className="bg-[#1a1f35] rounded-2xl p-6 h-32 animate-pulse" />
        </div>
        {/* Bar chart skeleton */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-10 animate-pulse">
          <div className="h-4 w-28 bg-gray-800 rounded mb-6" />
          <div className="flex items-end gap-2 h-48">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 bg-gray-800 rounded-t" style={{ height: `${20 + Math.random() * 60}%` }} />
            ))}
          </div>
        </div>
        {/* Progress bars skeleton */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-10 animate-pulse">
          <div className="h-4 w-28 bg-gray-800 rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 h-4 bg-gray-800 rounded" />
                <div className="flex-1 h-4 bg-gray-800 rounded-full" />
                <div className="w-12 h-4 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Stacked bars skeleton */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-10 animate-pulse">
          <div className="h-4 w-28 bg-gray-800 rounded mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-gray-800 rounded mb-2" />
                <div className="h-8 bg-gray-800 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        {/* Horizontal bars skeleton */}
        <div className="bg-[#1a1f35] rounded-2xl p-6 mb-10 animate-pulse">
          <div className="h-4 w-28 bg-gray-800 rounded mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-28 h-4 bg-gray-800 rounded" />
                <div className="flex-1 h-5 bg-gray-800 rounded-full" />
                <div className="w-20 h-4 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <main className="min-h-screen bg-[#0f1225] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🎬</div>
        <h2 className="text-2xl font-bold text-white mb-3">暂无数据</h2>
        <p className="text-gray-400 mb-8">成为第一个参与者！</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-amber-500 text-gray-900 font-semibold text-lg rounded-lg hover:bg-amber-400 hover:scale-105 transition-all duration-300"
        >
          开始测试
        </Link>
      </div>
    </main>
  );
}
