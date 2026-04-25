import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  let statsCount = 0;
  try {
    const statsPath = path.join(process.cwd(), "data", "stats.json");
    const data = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
    statsCount = data.totalSubmissions || 0;
  } catch {}

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "unknown",
    stats: { totalSubmissions: statsCount },
  });
}
