"use client";

import { useState } from "react";
import Link from "next/link";

export default function TicketTearTestPage() {
  const [isTearing, setIsTearing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTear = () => {
    setIsTearing(true);
    setTimeout(() => {
      setShowResult(true);
      setIsTearing(false);
    }, 1500);
  };

  const handleReset = () => {
    setShowResult(false);
    setIsTearing(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* 返回链接 */}
      <Link
        href="/"
        className="fixed top-6 left-6 text-gray-500 hover:text-amber-400 transition-colors"
      >
        ← 返回首页
      </Link>

      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-4 font-playfair">
          电影票根撕纸效果测试
        </h1>
        <p className="text-gray-400 text-center mb-12">
          点击按钮体验票根撕裂动画效果
        </p>

        {/* 票根容器 */}
        <div className="relative">
          {/* 票根主体 */}
          <div
            className={`relative bg-gradient-to-b from-[#1a1f35] to-[#151929] rounded-lg overflow-hidden transition-all duration-300 ${
              isTearing ? "animate-ticket-tear" : ""
            }`}
            style={{
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* 票根顶部锯齿 */}
            <div className="relative h-3 overflow-hidden">
              <svg
                className="absolute top-0 left-0 w-full"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,10 L5,0 L10,10 L15,0 L20,10 L25,0 L30,10 L35,0 L40,10 L45,0 L50,10 L55,0 L60,10 L65,0 L70,10 L75,0 L80,10 L85,0 L90,10 L95,0 L100,10"
                  fill="#0a0e1a"
                />
              </svg>
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
                {!showResult ? (
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      点击下方按钮开始测试
                    </p>
                    <button
                      onClick={handleTear}
                      disabled={isTearing}
                      className="px-8 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg
                                 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300"
                    >
                      {isTearing ? "撕票中..." : "开始撕票"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="font-playfair text-6xl font-bold text-amber-400">
                      EXPL
                    </div>
                    <p className="text-xl text-white">探索者</p>
                    <p className="text-sm text-gray-400 italic">
                      "在银幕上寻找未知的世界"
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-4 px-6 py-2 bg-[#222845] text-gray-300 rounded-lg
                                 hover:bg-[#2a3050] transition-all duration-300"
                    >
                      重新测试
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 票根底部锯齿 */}
            <div className="relative h-3 overflow-hidden">
              <svg
                className="absolute bottom-0 left-0 w-full"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 L5,10 L10,0 L15,10 L20,0 L25,10 L30,0 L35,10 L40,0 L45,10 L50,0 L55,10 L60,0 L65,10 L70,0 L75,10 L80,0 L85,10 L90,0 L95,10 L100,0"
                  fill="#0a0e1a"
                />
              </svg>
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

        {/* 说明文字 */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>✨ 效果说明：</p>
          <ul className="text-left inline-block space-y-1">
            <li>• 票根边缘的锯齿设计</li>
            <li>• 虚线穿孔效果</li>
            <li>• 撕票时的动态撕裂线</li>
            <li>• 纸屑飞散效果</li>
            <li>• 平滑的过渡动画</li>
          </ul>
        </div>
      </div>

      {/* 全局样式 */}
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
      `}</style>
    </main>
  );
}
