"use client";

import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";

export default function LandingPage() {
  const router = useRouter();

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

        <p className="text-gray-400 mb-12 text-base">
          回答 {questions.length} 个问题，发现你的电影人格类型
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/quiz")}
            className="px-12 py-4 bg-amber-500 text-gray-900 font-semibold text-lg rounded-lg
                       hover:bg-amber-400 hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0a0e1a]"
          >
            开始测试
          </button>
          <button
            onClick={() => router.push("/encyclopedia")}
            className="px-12 py-4 bg-[#1a1f35] text-gray-300 font-semibold text-lg rounded-lg
                       border border-gray-700 hover:bg-[#222845] hover:text-white hover:border-gray-600
                       transition-all duration-300"
          >
            探索图鉴
          </button>
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-gray-600">
          灵感来自 MBTI，致敬每一位影迷
        </p>
      </div>
    </main>
  );
}
