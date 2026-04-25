import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("[TMDB_PROXY_ERROR] TMDB_API_KEY not configured");
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=zh-CN&page=1`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[TMDB_PROXY_ERROR]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
  }
}
