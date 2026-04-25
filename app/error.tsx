"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[APP_ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] text-white">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold mb-4">页面出了点问题</h2>
        <p className="text-gray-400 mb-6">
          抱歉，页面遇到了意外错误。你可以尝试重新加载。
        </p>
        <button
          onClick={unstable_retry}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium"
        >
          重新加载
        </button>
        <p className="text-gray-600 text-xs mt-4">
          如果问题持续存在，请刷新整个页面
        </p>
      </div>
    </div>
  );
}
