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
    common: "当代观众",
    uncommon: "跨代观众",
    rare: "影史漫游者",
    legendary: "时间旅人",
  },
  beta: {
    common: "故事优先",
    uncommon: "氛围捕手",
    rare: "感官猎人",
    legendary: "通感者",
  },
  gamma: {
    common: "主流观众",
    uncommon: "邻国通",
    rare: "世界公民",
    legendary: "无国界影人",
  },
};

function getRarity(attr: string, score: number): string {
  const thresholds: Record<string, number[]> = {
    alpha: [2, 5, 8],
    beta: [3, 7, 12],
    gamma: [1, 3, 5],
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

// Profile description phrases
const hallPhrases: Record<string, string> = {
  "巨幕信徒": "你追求的是视觉的极致震撼",
  "声控画质党": "你对声画品质有着近乎偏执的要求",
  "性价比玩家": "你懂得在体验和预算之间找到最佳平衡",
  "内容至上": "对你来说，放什么比在哪放更重要",
  "随缘派": "你不挑场地，电影本身才是主角",
  "居家党": "你的私人影院就是最舒适的沙发",
  "未选择": "",
};

const envPhrases: Record<string, string> = {
  "影院原教旨主义者": "大银幕的仪式感是你的信仰",
  "沙发哲学家": "窝在家里才能真正沉入电影的世界",
  "场景切换大师": "你会为每部电影挑选最合适的观影场景",
  "随遇而安": "哪里都能看，重要的是看什么",
  "未选择": "",
};

const socialPhrases: Record<string, string> = {
  "独行侠": "你享受一个人与银幕之间的私密对话",
  "散场话事人": "看完电影和人聊上半小时才算完整",
  "集体共振追求者": "满座影厅里的集体情绪共振让你着迷",
  "百搭观众": "独处或同行，你都能自在享受",
  "未选择": "",
};

const stylePhrases: Record<string, string> = {
  "首映场占座王": "每一部期待的片子，你都要第一时间锁定",
  "随心所欲派": "突然想看就走进影院，这是你的浪漫",
  "口碑鉴定师": "你更愿意等口碑沉淀后再做选择",
  "线上原住民": "流媒体是你探索电影世界的主阵地",
  "未选择": "",
};

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
      desc: "在哪看、怎么看都无所谓，重要的是看什么。你是最纯粹的内容主义者。",
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
  ];

  // 尝试匹配画像原型
  for (const archetype of archetypes) {
    const entries = Object.entries(archetype.match);
    const dims: Record<string, string> = { hall, environment, social, style };
    if (entries.every(([key, val]) => dims[key] === val)) {
      return archetype.desc;
    }
  }

  // 未匹配到原型，回退到逐句拼接逻辑
  // Collect all non-empty phrases
  const phrases: string[] = [];

  const hallPhrase = hallPhrases[hall];
  if (hallPhrase) phrases.push(hallPhrase);

  const envPhrase = envPhrases[environment];
  if (envPhrase) phrases.push(envPhrase);

  const socialPhrase = socialPhrases[social];
  if (socialPhrase) phrases.push(socialPhrase);

  const stylePhrase = stylePhrases[style];
  if (stylePhrase) phrases.push(stylePhrase);

  // If no phrases, return empty string (this shouldn't happen as caller checks)
  if (phrases.length === 0) return "";

  // If only one phrase, return it directly
  if (phrases.length === 1) return phrases[0] + "。";

  // If 2 or more phrases, join with commas and add "而" before the last one
  const allButLast = phrases.slice(0, -1);
  const last = phrases[phrases.length - 1];
  return allButLast.join("。") + "，而" + last + "。";
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
      crime: 0,
      animation: 0,
      documentary: 0,
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

    // Profile tags from Q51-Q53, Q50
    if (q.profileTags && optionIndices.length === 1) {
      profileTags[q.id] = q.profileTags[optionIndices[0]];
    }
  });

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
  const maxThresholds: Record<string, number> = { alpha: 8, beta: 12, gamma: 5 };
  const max = maxThresholds[attr] ?? 10;
  return Math.max(0, Math.min(1, raw / max));
}
