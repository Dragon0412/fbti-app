import { NextRequest, NextResponse } from "next/server";
import { updateStats } from "@/utils/stats-store";

const VALID_TYPES = [
  "ARCH", "CHRN", "CRIT", "CULT", "DRAM", "EXPL", "HIST",
  "MODR", "NOIR", "POPG", "REAL", "RETF", "ROMN", "SCFI", "SURR", "VISL"
];

function validateSubmission(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid payload' };
  const d = data as Record<string, unknown>;

  if (!d.result || typeof d.result !== 'object') return { valid: false, error: 'Missing result' };
  const r = d.result as Record<string, unknown>;

  if (!VALID_TYPES.includes(r.type as string)) return { valid: false, error: 'Invalid type' };

  if (!r.delta || typeof r.delta !== 'object') return { valid: false, error: 'Missing delta' };
  const delta = r.delta as Record<string, number>;
  const genes = ['narrative', 'visual', 'emotion', 'intellect', 'social', 'sensory', 'escapism'];
  for (const g of genes) {
    if (typeof delta[g] !== 'number' || delta[g] < 0 || delta[g] > 100) {
      return { valid: false, error: `Invalid delta.${g}` };
    }
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateSubmission(body);
    if (!validation.valid) {
      console.error('[STATS_VALIDATION_ERROR]', validation.error, JSON.stringify(body).slice(0, 200));
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { result } = body;

    // 基本数据校验
    if (
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

    console.log('[STATS_RECORDED]', { type: result.type, geneShape: result.geneShape });

    return NextResponse.json({ success: true, message: "Recorded" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
