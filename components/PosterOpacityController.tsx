"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 海报墙可见度控制器
 * 根据当前页面路径，在 <body> 上设置 --poster-opacity CSS 变量
 * 
 * 注意力等级体系：
 * - 浏览型 (0.25): 首页、图鉴、统计、测试入口
 * - 交互型 (0.15): 答题页
 * - 沉浸型 (0.08): 结果页、票根页
 */

const OPACITY_MAP: Record<string, string> = {
  "/": "0.25",
  "/encyclopedia": "0.25",
  "/stats": "0.25",
  "/test": "0.25",
  "/quiz": "0.15",
  "/test/quiz": "0.15",
  "/result": "0.08",
  "/test-ticket": "0.08",
};

const DEFAULT_OPACITY = "0.18";

// 需要固定一屏、禁止滚动的页面
const FULLSCREEN_PAGES = new Set(["/", "/quiz", "/test/quiz"]);

export default function PosterOpacityController() {
  const pathname = usePathname();

  useEffect(() => {
    const opacity = OPACITY_MAP[pathname] ?? DEFAULT_OPACITY;
    document.body.style.setProperty("--poster-opacity", opacity);

    const isFullscreen = FULLSCREEN_PAGES.has(pathname);
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    }

    return () => {
      document.body.style.removeProperty("--poster-opacity");
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [pathname]);

  return null;
}
