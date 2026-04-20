"use client";

import { useState } from "react";
import Link from "next/link";
import { personalityTypes } from "@/data/types";

// 四大维度数据
const dimensions = [
  {
    code: "EA",
    name: "感知模式",
    left: { code: "E", name: "共情", desc: "用情感和直觉感受电影" },
    right: { code: "A", name: "解析", desc: "用理性和技法解读电影" },
  },
  {
    code: "XS",
    name: "探索方式",
    left: { code: "X", name: "拓荒", desc: "跨越文化与类型的边界" },
    right: { code: "S", name: "深耕", desc: "在一个领域越走越深" },
  },
  {
    code: "PW",
    name: "叙事引力",
    left: { code: "P", name: "微光", desc: "聚焦个人的内心旅程" },
    right: { code: "W", name: "广角", desc: "展开时代的全景格局" },
  },
  {
    code: "LD",
    name: "影调趋向",
    left: { code: "L", name: "向阳", desc: "向往温暖和希望" },
    right: { code: "D", name: "逐暗", desc: "深入黑暗与反思" },
  },
];

// 专属印记勋章数据
const hiddenAttributes = {
  alpha: {
    icon: "α",
    name: "时间穿越者",
    desc: "你的影史跨度",
    levels: [
      { rarity: "common", label: "影院漫步者", desc: "主要关注近年电影" },
      { rarity: "uncommon", label: "十年藏家", desc: "跨越不同年代观影" },
      { rarity: "rare", label: "影史漫游者", desc: "广泛涉猎影史各时期" },
      { rarity: "legendary", label: "时间旅人", desc: "真正的影史百科" },
    ],
  },
  beta: {
    icon: "β",
    name: "形式感应器",
    desc: "你对电影形式的感知",
    levels: [
      { rarity: "common", label: "故事优先", desc: "更关注故事本身" },
      { rarity: "uncommon", label: "氛围捕手", desc: "开始注意视听语言" },
      { rarity: "rare", label: "感官猎人", desc: "对电影形式高度敏感" },
      { rarity: "legendary", label: "影像魔法师", desc: "视听形式的极致感知" },
    ],
  },
  gamma: {
    icon: "γ",
    name: "文化通行证",
    desc: "你的国际观影广度",
    levels: [
      { rarity: "common", label: "本土影迷", desc: "以主流好莱坞为主" },
      { rarity: "uncommon", label: "邻国通", desc: "开始接触亚洲/欧洲电影" },
      { rarity: "rare", label: "世界公民", desc: "广泛接触各国电影" },
      { rarity: "legendary", label: "无国界影人", desc: "真正的世界电影公民" },
    ],
  },
};

// 稀有度颜色配置
const rarityColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  common: {
    bg: "bg-gray-800",
    text: "text-gray-300",
    border: "border-gray-700",
    badge: "bg-gray-600",
  },
  uncommon: {
    bg: "bg-green-900/30",
    text: "text-green-300",
    border: "border-green-800",
    badge: "bg-green-700",
  },
  rare: {
    bg: "bg-blue-900/30",
    text: "text-blue-300",
    border: "border-blue-800",
    badge: "bg-blue-700",
  },
  legendary: {
    bg: "bg-amber-900/20",
    text: "text-amber-300",
    border: "border-amber-700",
    badge: "bg-amber-600",
  },
};

// 类型基因数据
const typeGenes = [
  { key: "horror", label: "幽谷", reveal: "恐怖", desc: "偏好惊悚、悬疑、心理恐惧类叙事", color: "#a855f7" },
  { key: "comedy", label: "浮生", reveal: "喜剧", desc: "偏好幽默、荒诞、轻松解压的喜剧类型", color: "#fbbf24" },
  { key: "scifi", label: "异境", reveal: "科幻", desc: "偏好未来主义、太空探索、科技伦理类叙事", color: "#06b6d4" },
  { key: "crime", label: "暗局", reveal: "犯罪", desc: "偏好犯罪、黑帮、警匪、法庭类叙事", color: "#dc2626" },
  { key: "romance", label: "情澜", reveal: "爱情/言情", desc: "偏好爱情、言情、浪漫关系类叙事", color: "#ff6b9d" },
  { key: "action", label: "烈风", reveal: "动作/冒险", desc: "偏好动作、冒险、追逐、战斗类叙事", color: "#ff4500" },
];

// 人格代码颜色配置
const getCodeColors = (code: string) => {
  const chars = code.split("");
  return chars.map((char, index) => {
    if (index === 0) return { char, color: "text-amber-400" }; // E/A - amber
    if (index === 1) return { char, color: "text-blue-400" }; // X/S - blue
    return { char, color: "text-white" }; // P/W/L/D - white
  });
};

export default function EncyclopediaPage() {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [expandedDirectors, setExpandedDirectors] = useState<Set<string>>(new Set());
  const [expandedFilms, setExpandedFilms] = useState<Set<string>>(new Set());

  const toggleExpand = (code: string) => {
    setExpandedType(expandedType === code ? null : code);
  };

  const toggleDirectors = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDirectors((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const toggleFilms = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFilms((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <header className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            FBTI 图鉴
          </h1>
          <p className="text-gray-400 text-lg">
            探索所有电影人格类型与隐藏勋章
          </p>
        </header>

        {/* Section 1: 四大维度 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            <span className="text-amber-400">四大</span>维度
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimensions.map((dim) => (
              <div
                key={dim.code}
                className="bg-[#1a1f35] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="text-center mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{dim.code}</span>
                  <h3 className="text-lg font-semibold text-white mt-1">{dim.name}</h3>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center p-3 bg-[#0a0e1a] rounded-lg">
                    <span className="text-2xl font-bold text-amber-400 font-playfair">{dim.left.code}</span>
                    <p className="text-sm font-medium text-white mt-1">{dim.left.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{dim.left.desc}</p>
                  </div>
                  <span className="text-gray-600 font-light">vs</span>
                  <div className="flex-1 text-center p-3 bg-[#0a0e1a] rounded-lg">
                    <span className="text-2xl font-bold text-blue-400 font-playfair">{dim.right.code}</span>
                    <p className="text-sm font-medium text-white mt-1">{dim.right.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{dim.right.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: 16种人格类型 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            <span className="text-amber-400">16</span> 种电影人格
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(personalityTypes).map((type) => {
              const isExpanded = expandedType === type.code;
              const codeColors = getCodeColors(type.code);
              return (
                <div
                  key={type.code}
                  onClick={() => toggleExpand(type.code)}
                  className={`bg-[#1a1f35] rounded-xl p-5 border cursor-pointer transition-all duration-300 ${
                    isExpanded
                      ? "border-amber-500/50 ring-1 ring-amber-500/30"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {/* 人格代码 */}
                  <div className="flex justify-center gap-0.5 mb-3">
                    {codeColors.map(({ char, color }, idx) => (
                      <span
                        key={idx}
                        className={`text-3xl font-bold font-playfair ${color}`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                  {/* 名称 */}
                  <h3 className="text-center text-lg font-semibold text-white mb-2">
                    {type.name}
                  </h3>
                  {/* Tagline */}
                  <p className="text-center text-sm text-gray-500 italic mb-3 line-clamp-2">
                    &ldquo;{type.tagline}&rdquo;
                  </p>
                  {/* 展开详情 */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-sm text-gray-300 leading-relaxed mb-4">
                        {type.description}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">代表导演</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(expandedDirectors.has(type.code) ? type.directors : type.directors.slice(0, 5)).map((d) => (
                              <span
                                key={d}
                                className="px-2 py-0.5 bg-[#0a0e1a] rounded-full text-xs text-gray-400"
                              >
                                {d}
                              </span>
                            ))}
                            {type.directors.length > 5 && (
                              <button
                                onClick={(e) => toggleDirectors(type.code, e)}
                                className="px-2 py-0.5 rounded-full text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                              >
                                {expandedDirectors.has(type.code) ? "收起" : `+${type.directors.length - 5} 更多`}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">代表作品</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(expandedFilms.has(type.code) ? type.films : type.films.slice(0, 5)).map((f) => (
                              <span
                                key={f}
                                className="px-2 py-0.5 bg-[#0a0e1a] rounded-full text-xs text-gray-400"
                              >
                                {f}
                              </span>
                            ))}
                            {type.films.length > 5 && (
                              <button
                                onClick={(e) => toggleFilms(type.code, e)}
                                className="px-2 py-0.5 rounded-full text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                              >
                                {expandedFilms.has(type.code) ? "收起" : `+${type.films.length - 5} 更多`}
                              </button>
                            )}
                          </div>
                        </div>
                        {type.socialLabel && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">社交标签</p>
                            <p className="text-xs text-gray-400 italic">&ldquo;{type.socialLabel}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* 展开提示 */}
                  <div className="flex justify-center mt-3">
                    <span className="text-xs text-gray-600">
                      {isExpanded ? "点击收起" : "点击展开"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: 专属印记勋章体系 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            <span className="text-amber-400">专属</span>印记
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.values(hiddenAttributes).map((attr) => (
              <div
                key={attr.icon}
                className="bg-[#1a1f35] rounded-xl p-6 border border-gray-800"
              >
                <div className="text-center mb-4">
                  <span className={`text-4xl font-bold attr-${attr.icon === 'α' ? 'alpha' : attr.icon === 'β' ? 'beta' : 'gamma'}-icon block`}>{attr.icon}</span>
                  <h3 className="text-lg font-semibold text-white mt-2">{attr.name}</h3>
                  <p className="text-sm text-gray-500">{attr.desc}</p>
                </div>
                <div className="space-y-2">
                  {attr.levels.map((level) => {
                    const colors = rarityColors[level.rarity];
                    return (
                      <div
                        key={level.rarity}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                      >
                        <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${colors.badge}`}>
                          {level.rarity === "common" && "普通"}
                          {level.rarity === "uncommon" && "罕见"}
                          {level.rarity === "rare" && "稀有"}
                          {level.rarity === "legendary" && "传说"}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${colors.text}`}>{level.label}</p>
                          <p className="text-xs text-gray-500">{level.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: 类型基因 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            类型基因 <span className="text-amber-400">δ</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {typeGenes.map((gene) => (
              <div
                key={gene.key}
                className={`gene-label rounded-xl p-4 border text-center cursor-default`}
                style={{
                  borderColor: `${gene.color}40`,
                }}
              >
                <span className={`text-2xl font-bold block mb-1 gene-${gene.key}`}>
                  {gene.label}
                </span>
                <p className="text-xs mt-1" style={{ color: `${gene.color}99` }}>{gene.reveal}</p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{gene.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 页面底部 */}
        <section className="text-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-gray-900 font-semibold text-lg rounded-lg
                       hover:bg-amber-400 hover:scale-105 transition-all duration-300"
          >
            开始测试
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>

        {/* 页脚 */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600">
            FBTI &mdash; Film Buff Type Indicator · 灵感来自 MBTI，致敬每一位影迷
          </p>
        </footer>
      </div>
    </main>
  );
}
