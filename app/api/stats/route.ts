import { NextResponse } from "next/server";
import { readStats } from "@/utils/stats-store";

export async function GET() {
  try {
    const stats = readStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[STATS_READ_ERROR]', err);
    return NextResponse.json({ error: "Failed to read stats" }, { status: 500 });
  }
}
