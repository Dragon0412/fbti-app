import { NextRequest, NextResponse } from "next/server";
import { updateStats } from "@/utils/stats-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { result } = body;

    // 基本数据校验
    if (
      !result ||
      !result.type ||
      !result.delta ||
      !result.alpha?.rarity ||
      !result.beta?.rarity ||
      !result.gamma?.rarity ||
      !result.geneShape
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid result data" },
        { status: 400 }
      );
    }

    // 更新统计
    await updateStats({
      type: result.type,
      delta: result.delta,
      alpha: { rarity: result.alpha.rarity },
      beta: { rarity: result.beta.rarity },
      gamma: { rarity: result.gamma.rarity },
      geneShape: result.geneShape,
    });

    return NextResponse.json({ success: true, message: "Recorded" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
