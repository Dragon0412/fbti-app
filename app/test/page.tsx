"use client";

import { useRouter } from "next/navigation";
import { questions } from "@/data/questions-test";
import Tooltip from "@/components/Tooltip";

export default function TestLandingPage() {
  const router = useRouter();

  // 精简版：每个维度精选5道 + 4道观影画像题 = 24道
  const quickQuestionIds = [
    // EA 维度（5道）
    1, 2, 7, 8, 9,
    // XS 维度（5道）
    11, 12, 16, 19, 20,
    // PW 维度（5道）
    21, 26, 28, 29, 30,
    // LD 维度（5道）
    31, 33, 34, 37, 40,
    // 观影画像题（4道）- 帮助生成个性化推荐
    50, // 影厅偏好
    51, // 观影环境
    52, // 观影社交
    53, // 购票习惯
  ];

  // 精简版:24题,约2分钟;完整版:约5分钟
  const quickTime = 2; // 简易版 2 分钟
  const fullTime = 5; // 完整版 5 分钟

  const handleStartQuiz = (version: "quick" | "full") => {
    const ids = version === "quick" ? quickQuestionIds : questions.map((q) => q.id);
    sessionStorage.setItem("fbti_quiz_version", version);
    sessionStorage.setItem("fbti_question_ids", JSON.stringify(ids));
    sessionStorage.setItem("fbti_test_mode", "true"); // 标记为测试模式
    router.push("/test/quiz");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 48px, #d4a853 48px, #d4a853 50px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Test Mode Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full border border-amber-500/30">
            测试版 · 优化题目体验
          </span>
        </div>

        <div className="mb-2">
          <span className="text-amber-400/60 text-sm tracking-[0.3em] uppercase font-light">
            Film Buff Type Indicator
          </span>
        </div>

        <h1 className="font-playfair text-8xl md:text-9xl font-bold text-white tracking-tight mb-4">
          FBTI
        </h1>

        <h2 className="text-xl md:text-2xl text-gray-300 font-light mb-2">
          影迷类型指标
        </h2>

        <p className="text-lg text-amber-400/80 italic mb-8 font-playfair">
          &ldquo;每个人都是一座电影院。&rdquo;
        </p>

        <p className="text-gray-400 mb-8 text-base">
          发现你的电影人格类型
        </p>

        {/* Quiz version selection */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Quick version */}
          <Tooltip 
            text="24 道精选题目，快速测试" 
            mobileHint="24 题 · 约 2 分钟"
          >
            <button
              onClick={() => handleStartQuiz("quick")}
              className="group relative p-5 bg-[#1a1f35] rounded-xl border border-gray-700 hover:border-amber-500/50
                         hover:bg-[#222845] transition-all duration-300 text-left w-full"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium">快速测试</span>
                <span className="text-amber-400 text-sm font-medium">
                  约 {quickTime} 分钟
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                {quickQuestionIds.length} 道题 · 快速了解你的电影人格
              </div>
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-amber-400">→</span>
              </div>
            </button>
          </Tooltip>

          {/* Full version */}
          <Tooltip 
            text="完整题库，深度分析你的观影偏好" 
            mobileHint="完整题库 · 约 5 分钟"
          >
            <button
              onClick={() => handleStartQuiz("full")}
              className="group relative p-5 bg-[#1a1f35] rounded-xl border border-gray-700 hover:border-amber-500/50
                         hover:bg-[#222845] transition-all duration-300 text-left w-full"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium">完整版测试</span>
                <span className="text-amber-400 text-sm font-medium">
                  约 {fullTime} 分钟
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                {questions.length} 道题 · 深入了解你的观影偏好
              </div>
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-amber-400">→</span>
              </div>
            </button>
          </Tooltip>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Tooltip 
            text="返回正式版首页" 
            mobileHint="返回正式版"
          >
            <button
              onClick={() => router.push("/")}
              className="px-10 py-3 bg-[#1a1f35] text-gray-300 font-medium text-base rounded-lg
                         border border-gray-700 hover:bg-[#222845] hover:text-white hover:border-gray-600
                         transition-all duration-300"
            >
              返回正式版
            </button>
          </Tooltip>
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-gray-600">
          测试版题目 · 优化中
        </p>
      </div>
    </main>
  );
}
