"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StatsPreview() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setCount(data.totalCount ?? 0))
      .catch(() => setCount(0));
  }, []);

  return (
    <Link
      href="/stats"
      className="inline-flex items-center gap-3 px-6 py-3 bg-[#1a1f35] rounded-xl border border-gray-700/50
                 hover:border-amber-500/40 hover:bg-[#222845] transition-all duration-300 group cursor-default"
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">
          {count === null ? (
            <span className="inline-block w-8 h-4 bg-gray-700 rounded animate-pulse" />
          ) : (
            <>
              已有{" "}
              <span className="text-amber-400 font-semibold">
                {count.toLocaleString()}
              </span>{" "}
              位影迷完成测试
            </>
          )}
        </span>
      </div>
      <span className="text-gray-600 text-sm group-hover:text-amber-400/70 transition-colors">
        查看详情 →
      </span>
    </Link>
  );
}
