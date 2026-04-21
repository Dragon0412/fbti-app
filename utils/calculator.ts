import { questions, Question } from "@/data/questions";
import { directorsMeta, filmsMeta, scoreDirector, scoreFilm } from "@/data/directorsMeta";
import { personalityTypes } from "@/data/types";

export interface Scores {
  E: number;
  A: number;
  X: number;
  S: number;
  P: number;
  W: number;
  L: number;
  D: number;
}

export interface HiddenAttributes {
  alpha: { score: number; rarity: string; label: string };
  beta: { score: number; rarity: string; label: string };
  gamma: { score: number; rarity: string; label: string };
  delta: Record<string, number>;
}

export interface ProfileResult {
  hall: string;
  environment: string;
  social: string;
  style: string;
  description: string;
}

export interface Result {
  type: string;
  scores: Scores;
  percentages: Record<string, { winner: string; pct: number }>;
  hidden: HiddenAttributes;
  profile: ProfileResult | null;
  filmSociologist: boolean;
  skipCount: number;
  topDirectors: string[];
  topFilms: string[];
}

const RARITY_LABELS: Record<string, Record<string, string>> = {
  alpha: {
    common: "影院漫步者",
    uncommon: "十年藏家",
    rare: "影史漫游者",
    legendary: "时间旅人",
  },
  beta: {
    common: "故事优先",
    uncommon: "氛围捕手",
    rare: "感官猎人",
    legendary: "影像魔法师",
  },
  gamma: {
    common: "本土影迷",
    uncommon: "邻国通",
    rare: "世界公民",
    legendary: "无国界影人",
  },
};

function getRarity(attr: string, score: number): string {
  const thresholds: Record<string, number[]> = {
    alpha: [2, 4, 6],
    beta: [3, 7, 12],
    gamma: [2, 4, 6],
  };
  const t = thresholds[attr];
  if (!t) return "common";
  if (score > t[2]) return "legendary";
  if (score > t[1]) return "rare";
  if (score > t[0]) return "uncommon";
  return "common";
}

interface AnswerEntry {
  questionIndex: number;
  optionIndices: number[];
}

// === Fallback 编织模板 ===

// 环境开场句
const envOpeners: Record<string, string[]> = {
  "影院原教旨主义者": [
    "对你来说，电影就应该在黑暗的影厅里看——",
    "大银幕亮起的那一刻，仪式感就位了——",
  ],
  "沙发哲学家": [
    "你的理想观影姿势是瘫在沙发上，手边一杯热饮——",
    "窝在家里关上门，才是你进入电影世界的方式——",
  ],
  "场景切换大师": [
    "影院、卧室、通勤地铁……你的屏幕无处不在——",
    "你会为每部电影挑一个最对味的观影场景——",
  ],
  "随遇而安": [
    "有什么设备就用什么设备，你从不挑剔——",
    "在哪看不重要，重要的是看什么——",
  ],
};

// 影厅+社交桥接句
const hallSocialBridges: Record<string, Record<string, string[]>> = {
  "巨幕信徒": {
    "独行侠": ["你独自坐在IMAX最佳观影位，这就是你的冥想时间。"],
    "散场话事人": ["巨幕看完，散场后和朋友热烈复盘，这才是完整体验。"],
    "集体共振追求者": ["IMAX大厅里全场一起屏住呼吸那一刻，是你最爱的集体高潮。"],
    "百搭观众": ["巨幕是必须的，至于和谁一起看，你都OK。"],
  },
  "声控画质党": {
    "独行侠": ["杜比全景声配上一个人的专注，每个细节都不放过。"],
    "散场话事人": ["声画细节全收，看完还得和人逐帧讨论。"],
    "集体共振追求者": ["极致的声画体验加上满场的情绪共振，双重享受。"],
    "百搭观众": ["画质和音效是底线，社交方式倒是随意。"],
  },
  "性价比玩家": {
    "独行侠": ["花最少的钱，享受最安静的独处观影时光。"],
    "散场话事人": ["花最少的钱，看完电影后和朋友聊最多的天。"],
    "集体共振追求者": ["特价场加上满座的热闹氛围，性价比直接拉满。"],
    "百搭观众": ["不多花冤枉钱，和谁看都开心。"],
  },
  "内容至上": {
    "独行侠": ["你只在乎片子本身，一个人安静地看完就好。"],
    "散场话事人": ["片子是入场券，散场后的讨论才是正餐。"],
    "集体共振追求者": ["好内容配上全场共鸣，这种化学反应让你上瘾。"],
    "百搭观众": ["内容为王，其他都是浮云。"],
  },
  "随缘派": {
    "独行侠": ["不挑影厅，一个人说走就走，轻装上阵。"],
    "散场话事人": ["随便找个厅坐下，看完拉人开聊才是重点。"],
    "集体共振追求者": ["哪个厅无所谓，人多热闹就行。"],
    "百搭观众": ["不挑场地不挑人，你和电影的关系就是这么松弛。"],
  },
  "居家党": {
    "独行侠": ["深夜独自窝在被子里看完一部片，这种私密感无可替代。"],
    "散场话事人": ["在家看完立刻找人线上开聊，弹幕和群聊就是你的散场。"],
    "集体共振追求者": ["拉上朋友一起投屏，客厅秒变私人放映厅。"],
    "百搭观众": ["沙发一躺，管它独享还是共赏，都舒服。"],
  },
};

// 风格收尾句
const styleClosers: Record<string, string[]> = {
  "首映场占座王": [
    "新片上映第一天就要看到，这是原则。",
    "至于什么时候看？当然是第一时间。",
  ],
  "随心所欲派": [
    "今晚看什么？打开APP随便滑两下就行。",
    "突然想看就看，你的浪漫从不需要计划。",
  ],
  "口碑鉴定师": [
    "没有7分以上的评分？那就先放着吧。",
    "至于选什么片？你信口碑，信自己的判断。",
  ],
  "线上原住民": [
    "院线？那是什么？你的片源永远在线上。",
    "流媒体才是你探索电影世界的主阵地。",
  ],
};

// 单维度独立句（当只有单一维度时使用）
const hallSolo: Record<string, string> = {
  "巨幕信徒": "你追求的是视觉的极致震撼，巨幕才是看电影的正确打开方式。",
  "声控画质党": "你对声画品质有着近乎偏执的要求，每一帧都值得被认真对待。",
  "性价比玩家": "你懂得在体验和预算之间找到最佳平衡，聪明观影是一种态度。",
  "内容至上": "对你来说，放什么比在哪放更重要，内容永远是第一位。",
  "随缘派": "你不挑场地，电影本身才是主角。",
  "居家党": "你的私人影院就是最舒适的沙发，宅家观影才是正义。",
};

const socialSolo: Record<string, string> = {
  "独行侠": "你享受一个人与银幕之间的私密对话，独处是最高级的观影方式。",
  "散场话事人": "看完电影和人聊上半小时才算完整，讨论是观影的延伸。",
  "集体共振追求者": "满座影厅里的集体情绪共振让你着迷，一起看才有味道。",
  "百搭观众": "独处或同行，你都能自在享受，你和电影的关系很松弛。",
};

/**
 * Pick a random element from an array (deterministic by simple hash for consistency).
 */
function pickVariant(variants: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return variants[Math.abs(hash) % variants.length];
}

/**
 * Generate a natural, flowing profile description based on the four dimensions.
 */
function generateProfileDescription(
  hall: string,
  environment: string,
  social: string,
  style: string
): string {
  // 画像原型定义（按优先级排列：3值匹配在前，2值匹配在后）
  const archetypes = [
    // === 3值匹配（最高优先级）===
    {
      match: { hall: "巨幕信徒", environment: "影院原教旨主义者", style: "首映场占座王" },
      desc: "你是那种首映日必到IMAX厅的人——对你来说，电影不是内容消费，而是一场需要最高规格的朝圣仪式。",
    },
    {
      match: { hall: "居家党", environment: "沙发哲学家", social: "独行侠" },
      desc: "深夜，关灯，一个人窝在沙发里——你把独处和电影酿成了一种私密的精神仪式。",
    },
    {
      match: { hall: "声控画质党", environment: "影院原教旨主义者", social: "独行侠" },
      desc: "杜比厅、最佳座位、一个人——你对观影体验的要求近乎苛刻，但正因如此，每一次都是极致享受。",
    },
    {
      match: { environment: "沙发哲学家", social: "散场话事人", style: "口碑鉴定师" },
      desc: "等口碑沉淀，在家慢慢看，看完立刻找人聊——你的观影节奏从容而讲究，像品一壶好茶。",
    },
    {
      match: { hall: "随缘派", environment: "随遇而安", social: "百搭观众" },
      desc: "你不挑场地、不挑方式、不挑同伴。你和电影之间的关系，是最松弛的那种自在。",
    },
    {
      match: { environment: "影院原教旨主义者", social: "集体共振追求者", style: "首映场占座王" },
      desc: "首映夜的满座影厅，全场同呼吸共命运——这是你最上瘾的集体仪式。",
    },

    // === 2值匹配 ===
    {
      match: { social: "散场话事人", style: "首映场占座王" },
      desc: "第一时间看完，第一时间开聊——对你来说，电影体验从散场那一刻才真正开始。",
    },
    {
      match: { environment: "沙发哲学家", social: "独行侠" },
      desc: "你把独处变成了最高级的观影方式。一个人、一部电影、一段完全属于自己的时光。",
    },
    {
      match: { hall: "巨幕信徒", social: "集体共振追求者" },
      desc: "巨幕加满座，视觉轰炸配集体情绪共振——你追求的是电影最原始的那种震撼力。",
    },
    {
      match: { environment: "场景切换大师", style: "口碑鉴定师" },
      desc: "你会为每部电影挑选最合适的观影场景，也会耐心等口碑发酵再出手——你的观影策略，精准得像一位品鉴师。",
    },
    {
      match: { hall: "内容至上", environment: "随遇而安" },
      desc: `你属于那种“手机充电器都不带但片单肯定有”的人。在哪看、怎么看都不重要，你只关心一件事：今晚看什么。`,
    },
    {
      match: { environment: "影院原教旨主义者", social: "独行侠" },
      desc: "一个人走进影院，黑暗中与银幕独处——这是你和电影之间最神圣的相处方式。",
    },
    {
      match: { style: "线上原住民", social: "独行侠" },
      desc: "流媒体是你的领地，独自探索是你的方式。你在屏幕前建起了一座只属于自己的电影宇宙。",
    },
    {
      match: { style: "随心所欲派", environment: "影院原教旨主义者" },
      desc: "突然想看就走进影院——你的浪漫是即兴的，但对大银幕的执着是不变的。",
    },
    {
      match: { hall: "居家党", style: "线上原住民" },
      desc: "你的影院就在客厅，你的片库就在云端。不用出门，照样阅片无数。",
    },
    {
      match: { social: "集体共振追求者", style: "首映场占座王" },
      desc: "首映夜就是你的主场——和一群同样期待的人一起，感受全场的第一次集体心跳。",
    },

    // === 新增高频原型 ===
    {
      match: { hall: "居家党", social: "独行侠", style: "线上原住民" },
      desc: `深夜一个人穿着睡衣打开投屏，算法推荐全部关掉，只看自己的收藏夹。你是流媒体时代最自在的独行影迷。`,
    },
    {
      match: { hall: "巨幕信徒", social: "集体共振追求者", style: "首映场占座王" },
      desc: `IMAX厅、首映场、满座——你把看电影当成了追星现场。火爆的氛围和极致的视听缺一不可，这才叫“看电影”。`,
    },
    {
      match: { hall: "性价比玩家", style: "随心所欲派", social: "散场话事人" },
      desc: `临时起意、挑个性价比厅、看完拉朋友聊一个小时——你的观影流程随意但有仪式感，散场后的聊天才是真正的彩蛋。`,
    },
    {
      match: { environment: "沙发哲学家", social: "独行侠", style: "口碑鉴定师" },
      desc: `等豆瓣评分稳定了再动手，一个人窝在家里慢慢看。你是观影派里的安全型选手，口碑是你的护身符，沙发是你的主场。`,
    },
  ];

  // 尝试匹配画像原型
  for (const archetype of archetypes) {
    const entries = Object.entries(archetype.match);
    const dims: Record<string, string> = { hall, environment, social, style };
    if (entries.every(([key, val]) => dims[key] === val)) {
      return archetype.desc;
    }
  }

  // 未匹配到原型，使用上下文感知的编织逻辑
  const seed = `${hall}|${environment}|${social}|${style}`;
  const hasEnv = environment !== "未选择";
  const hasHall = hall !== "未选择";
  const hasSocial = social !== "未选择";
  const hasStyle = style !== "未选择";

  const dimCount = [hasEnv, hasHall, hasSocial, hasStyle].filter(Boolean).length;

  // 无任何维度
  if (dimCount === 0) return "";

  // 只有一个维度，返回独立句
  if (dimCount === 1) {
    if (hasEnv) return pickVariant(envOpeners[environment] ?? [], seed).replace(/——$/, "这就是你。");
    if (hasHall) return hallSolo[hall] ?? "";
    if (hasSocial) return socialSolo[social] ?? "";
    if (hasStyle) return pickVariant(styleClosers[style] ?? [], seed);
    return "";
  }

  // 多维度编织
  const parts: string[] = [];

  // 1. 环境开场
  if (hasEnv) {
    parts.push(pickVariant(envOpeners[environment] ?? [], seed));
  }

  // 2. 影厅+社交桥接
  if (hasHall && hasSocial) {
    const bridges = hallSocialBridges[hall]?.[social];
    if (bridges) {
      parts.push(pickVariant(bridges, seed));
    } else {
      // 无预定义桥接，分别添加
      parts.push(hallSolo[hall] ?? "");
      parts.push(socialSolo[social] ?? "");
    }
  } else if (hasHall) {
    parts.push(hallSolo[hall] ?? "");
  } else if (hasSocial) {
    parts.push(socialSolo[social] ?? "");
  }

  // 3. 风格收尾
  if (hasStyle) {
    parts.push(pickVariant(styleClosers[style] ?? [], seed));
  }

  return parts.filter(Boolean).join("");
}

export function calculateResult(answers: AnswerEntry[]): Result {
  const scores: Scores = {
    E: 0,
    A: 0,
    X: 0,
    S: 0,
    P: 0,
    W: 0,
    L: 0,
    D: 0,
  };

  const hidden = {
    alpha: 0,
    beta: 0,
    gamma: 0,
    delta: {
      horror: 0,
      comedy: 0,
      scifi: 0,
      romance: 0,
      action: 0,
      drama: 0,
      animation: 0,
    },
  };

  let skipCount = 0;
  const profileTags: Record<number, string> = {};

  // Track ideology questions for "film sociologist" easter egg
  const ideologyQIds = [10, 27, 37, 38, 45, 46];
  let ideologySubstantive = 0;
  let ideologyDarkSignals = 0;

  answers.forEach(({ questionIndex, optionIndices }) => {
    const q = questions[questionIndex];
    if (!q) return;

    const isMultiSelect = q.questionType === "multiSelect";
    const substantiveCount = optionIndices.filter(
      (i) => q.options[i]?.type !== "skip"
    ).length;

    optionIndices.forEach((optIdx) => {
      const opt = q.options[optIdx];
      if (!opt) return;

      if (opt.type === "skip") {
        skipCount++;
        // Q48 skip gives L +0.5
        if (q.id === 48) {
          scores.L += 0.5;
        }
      }

      // Skip items don't contribute to main dimension scores (except Q48 skip)
      if (opt.type === "skip") return;

      // multiSelect weighting: 1 / number of substantive selections
      const weight = isMultiSelect ? 1 / substantiveCount : 1;

      // Main dimension scores
      if (opt.scores) {
        Object.entries(opt.scores).forEach(([dim, val]) => {
          const key = dim as keyof Scores;
          if (key in scores) {
            scores[key] += val * weight;
          }
        });
      }

      // Hidden signals
      if (opt.hiddenSignals) {
        opt.hiddenSignals.forEach((signal) => {
          switch (signal.attribute) {
            case "\u03b1":
              hidden.alpha += signal.weight;
              break;
            case "\u03b2":
              hidden.beta += signal.weight;
              break;
            case "\u03b3":
              hidden.gamma += signal.weight;
              break;
            case "\u03b4":
              if (signal.genre) {
                const genreKey = signal.genre as keyof typeof hidden.delta;
                if (hidden.delta[genreKey] !== undefined) {
                  hidden.delta[genreKey] += signal.weight;
                }
              }
              break;
          }
        });
      }

      // Film sociologist tracking
      if (ideologyQIds.includes(q.id) && opt.type === "substantive") {
        ideologySubstantive++;
        if (opt.scores?.D || opt.scores?.W) {
          ideologyDarkSignals++;
        }
      }
    });

    // Profile tags from Q50-Q53
    if (q.profileTags && optionIndices.length > 0) {
      if ([50, 51, 52, 53].includes(q.id)) {
        // 画像题：多选时取第一个实质选项的标签
        const firstSubstantive = optionIndices.find(
          (i) => q.options[i]?.type === "substantive"
        );
        if (firstSubstantive !== undefined) {
          profileTags[q.id] = q.profileTags[firstSubstantive];
        }
      } else if (optionIndices.length === 1) {
        // 非画像题保持原逻辑
        profileTags[q.id] = q.profileTags[optionIndices[0]];
      }
    }
  });

  // 精简版权重补偿：答题数 <= 25 视为精简版
  const isQuickMode = answers.length <= 25;
  if (isQuickMode) {
    hidden.alpha = Math.round(hidden.alpha * 1.1);
    hidden.beta = Math.round(hidden.beta * 1.2);
    hidden.gamma = Math.round(hidden.gamma * 1.5);
    (Object.keys(hidden.delta) as (keyof typeof hidden.delta)[]).forEach((k) => {
      hidden.delta[k] = Math.round(hidden.delta[k] * 1.3);
    });
  }

  // Clamp hidden attributes to 0
  hidden.alpha = Math.max(0, hidden.alpha);
  hidden.beta = Math.max(0, hidden.beta);
  hidden.gamma = Math.max(0, hidden.gamma);
  (Object.keys(hidden.delta) as (keyof typeof hidden.delta)[]).forEach((k) => {
    hidden.delta[k] = Math.max(0, hidden.delta[k]);
  });

  // Type determination
  const type = [
    scores.E >= scores.A ? "E" : "A",
    scores.X >= scores.S ? "X" : "S",
    scores.P >= scores.W ? "P" : "W",
    scores.L >= scores.D ? "L" : "D",
  ].join("");

  // Percentages (relative within each pair)
  const dimPairs = [
    { pair: "EA", keys: ["E", "A"] as [keyof Scores, keyof Scores] },
    { pair: "XS", keys: ["X", "S"] as [keyof Scores, keyof Scores] },
    { pair: "PW", keys: ["P", "W"] as [keyof Scores, keyof Scores] },
    { pair: "LD", keys: ["L", "D"] as [keyof Scores, keyof Scores] },
  ];

  const percentages: Record<string, { winner: string; pct: number }> = {};
  dimPairs.forEach(({ pair, keys }) => {
    const total = scores[keys[0]] + scores[keys[1]];
    const maxScore = Math.max(scores[keys[0]], scores[keys[1]]);
    const winner = scores[keys[0]] >= scores[keys[1]] ? keys[0] : keys[1];
    percentages[pair] = {
      winner,
      pct: total > 0 ? Math.round((maxScore / total) * 100) : 50,
    };
  });

  // Film sociologist check
  const q37Ans = answers.find((a) => questions[a.questionIndex]?.id === 37);
  const q38Ans = answers.find((a) => questions[a.questionIndex]?.id === 38);
  const q37IsD =
    q37Ans?.optionIndices.some(
      (i) => questions[q37Ans.questionIndex]?.options[i]?.scores?.D
    ) ?? false;
  const q38IsD =
    q38Ans?.optionIndices.some(
      (i) => questions[q38Ans.questionIndex]?.options[i]?.scores?.D
    ) ?? false;
  const filmSociologist =
    (q37IsD && q38IsD) ||
    (ideologySubstantive >= 4 && ideologyDarkSignals >= 2);

  // Profile generation
  const hall = profileTags[50] ?? "未选择";
  const environment = profileTags[51] ?? "未选择";
  const social = profileTags[52] ?? "未选择";
  const style = profileTags[53] ?? "未选择";

  const profile: ProfileResult | null =
    profileTags[50] || profileTags[51] || profileTags[52] || profileTags[53]
      ? {
          hall,
          environment,
          social,
          style,
          description: generateProfileDescription(hall, environment, social, style),
        }
      : null;

  return {
    type,
    scores,
    percentages,
    hidden: {
      alpha: {
        score: hidden.alpha,
        rarity: getRarity("alpha", hidden.alpha),
        label:
          RARITY_LABELS.alpha[getRarity("alpha", hidden.alpha)] ?? "",
      },
      beta: {
        score: hidden.beta,
        rarity: getRarity("beta", hidden.beta),
        label:
          RARITY_LABELS.beta[getRarity("beta", hidden.beta)] ?? "",
      },
      gamma: {
        score: hidden.gamma,
        rarity: getRarity("gamma", hidden.gamma),
        label:
          RARITY_LABELS.gamma[getRarity("gamma", hidden.gamma)] ?? "",
      },
      delta: hidden.delta,
    },
    profile,
    filmSociologist,
    skipCount,
    topDirectors: selectTopDirectors(type, hidden),
    topFilms: selectTopFilms(type, hidden),
  };
}

/**
 * Select top 3 directors for the given personality type based on
 * the user's α (era), β (style), and γ (diversity) hidden scores.
 */
function selectTopDirectors(type: string, hiddenRaw: { alpha: number; beta: number; gamma: number; delta: Record<string, number> }): string[] {
  const typeData = personalityTypes[type];
  if (!typeData) return [];

  // Normalize α/β/γ to 0-1 range using their rarity thresholds
  const alphaNorm = normalizeScore(hiddenRaw.alpha, "alpha");
  const betaNorm = normalizeScore(hiddenRaw.beta, "beta");
  const gammaNorm = normalizeScore(hiddenRaw.gamma, "gamma");

  const scored = typeData.directors
    .map((name) => {
      const meta = directorsMeta[name];
      if (!meta) return { name, score: 0 };
      return { name, score: scoreDirector(meta, alphaNorm, betaNorm, gammaNorm) };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((s) => s.name);
}

/**
 * Select top 3 films for the given personality type based on
 * the user's α/β/γ hidden scores, blended with the director score.
 */
function selectTopFilms(type: string, hiddenRaw: { alpha: number; beta: number; gamma: number; delta: Record<string, number> }): string[] {
  const typeData = personalityTypes[type];
  if (!typeData) return [];

  const alphaNorm = normalizeScore(hiddenRaw.alpha, "alpha");
  const betaNorm = normalizeScore(hiddenRaw.beta, "beta");
  const gammaNorm = normalizeScore(hiddenRaw.gamma, "gamma");

  const scored = typeData.films
    .map((title) => {
      const meta = filmsMeta[title];
      if (!meta) return { title, score: 0 };
      const dirMeta = directorsMeta[meta.director];
      const dirScore = dirMeta ? scoreDirector(dirMeta, alphaNorm, betaNorm, gammaNorm) : 0.5;
      return { title, score: scoreFilm(meta, alphaNorm, betaNorm, gammaNorm, dirScore) };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((s) => s.title);
}

/**
 * Normalize a raw hidden attribute score to 0-1 range.
 * Uses the legendary threshold as the max reference point.
 */
function normalizeScore(raw: number, attr: "alpha" | "beta" | "gamma"): number {
  const maxThresholds: Record<string, number> = { alpha: 6, beta: 12, gamma: 6 };
  const max = maxThresholds[attr] ?? 10;
  return Math.max(0, Math.min(1, raw / max));
}
