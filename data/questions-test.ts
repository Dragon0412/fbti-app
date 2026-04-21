export interface HiddenSignal {
  attribute: "α" | "β" | "γ" | "δ";
  genre?: string;
  weight: number;
}

export interface TmdbFilm {
  title_zh: string;
  title_en: string;
  year: number;
  hover: string;
}

export interface AiPrompt {
  position: "left" | "right" | "single";
  prompt: string;
}

export interface QuestionImage {
  type: "tmdb" | "ai_placeholder";
  layout: "single" | "split" | "grid3" | "grid4";
  tmdb?: TmdbFilm[];
  aiPrompts?: AiPrompt[];
}

export interface QuestionOption {
  label: string;
  scores: Record<string, number>;
  hiddenSignals?: HiddenSignal[];
  type: "substantive" | "skip";
}

export interface Question {
  id: number;
  questionType: "binary" | "multi" | "binary_with_skip" | "multiSelect";
  primaryDimension: "EA" | "XS" | "PW" | "LD" | "none";
  text: string;
  options: QuestionOption[];
  image?: QuestionImage;
  profileTags?: Record<number, string>;
  maxSelect?: number;
}

export const questions: Question[] = [
  // ==================== E/A 维度：感受流 vs 拆片流（14题）====================

  // Q1 · 观影后反应 (binary) - 选项B调整
  {
    id: 1,
    questionType: "binary",
    primaryDimension: "EA",
    text: "看完一部好电影，走出影院时你最想做的事是？",
    options: [
      {
        label: "找个安静的地方待一会儿，让情绪慢慢消化",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "立刻找个出口——要么找人聊，要么刷影评看讨论，总之想听听别人怎么说",
        scores: { A: 1 },
        type: "substantive",
      },
    ],
  },

  // Q2 · 推荐方式 (binary) - 选项B调整
  {
    id: 2,
    questionType: "binary",
    primaryDimension: "EA",
    text: "朋友让你推荐一部最近看的好片，你会怎么说？",
    options: [
      {
        label: "就是那种看完走在回家路上，还会一直回味的电影",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "导演/摄影师的手法特别聪明——不管是叙事节奏、镜头运动还是视觉构图，都是教科书级别",
        scores: { A: 1 },
        type: "substantive",
      },
    ],
  },

  // Q3 · 重看动机 (binary)
  {
    id: 3,
    questionType: "binary",
    primaryDimension: "EA",
    text: "你会因为什么重看一部看过的电影？",
    options: [
      {
        label: "想再感受一次那种情绪——不管是温暖还是心碎",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "有个细节我一直想着，想回去再看一遍确认",
        scores: { A: 1 },
        type: "substantive",
      },
    ],
  },

  // Q4 · 纪录片视角 (binary) + AI placeholder
  {
    id: 4,
    questionType: "binary",
    primaryDimension: "EA",
    text: "看一部关于真实灾难的纪录片，什么最触动你？",
    options: [
      {
        label: "镜头里那些真实人物的面孔和声音",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "导演为什么选这些素材、剪掉什么——他在表达什么立场",
        scores: { A: 1 },
        hiddenSignals: [
          { attribute: "β", weight: 1 },
        ],
        type: "substantive",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "徒手攀岩",
          title_en: "Free Solo",
          year: 2018,
          hover: "徒手攀岩 (Free Solo) · 2018 · 导演: 金国威 / 伊丽莎白·柴·瓦沙瑞莉 · 奥斯卡最佳纪录片 · 亚历克斯·霍诺德徒手攀登酋长岩",
        },
      ],
    },
  },

  // Q5 · "技术好但冷" 的取舍 (binary)
  {
    id: 5,
    questionType: "binary",
    primaryDimension: "EA",
    text: "一部电影摄影和剪辑都特别棒，但你全程没什么感觉。你会觉得？",
    options: [
      {
        label: "有点可惜——技术再厉害，打动不了人还是差了点什么",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "挺厉害的——好电影不一定非要煽情，纯粹的形式美也是一种境界",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q6 · 争议片立场 (binary)
  {
    id: 6,
    questionType: "binary",
    primaryDimension: "EA",
    text: "一部豆瓣 6.8 分的电影，你觉得不太好看。你的「不好看」主要来自？",
    options: [
      {
        label: "看完没什么感觉——它没有真正触动到我",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "叙事有硬伤，角色行为不合理，主题太浅",
        scores: { A: 1 },
        type: "substantive",
      },
    ],
  },

  // Q7 · 恐怖片状态 (multi) - 重新设计，从binary变为multi
  {
    id: 7,
    questionType: "multi",
    primaryDimension: "EA",
    text: "看恐怖片时，你的心态更接近哪一种？",
    options: [
      {
        label: "完全浸入恐怖中——被吓到是享受，紧张的氛围本身就是最好的体验",
        scores: { E: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "horror", weight: 1 },
          { attribute: "δ", genre: "action", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "一边看一边拆解——这个演员的尖叫是不是不够自然，这个转场设计得咋样",
        scores: { A: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "horror", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "既不能完全沉浸，也不会真的分析——就是普通地看，等着故事吓唬你",
        scores: { E: 0.3, A: 0.3 },
        type: "substantive",
      },
      {
        label: "我基本不看恐怖片",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "闪灵",
          title_en: "The Shining",
          year: 1980,
          hover: "闪灵 (The Shining) · 1980 · 导演: 斯坦利·库布里克 · 影史经典恐怖片 · 杰克·尼科尔森封神之作",
        },
      ],
    },
  },

  // Q8 · 配乐感知 (binary_with_skip) + TMDB
  {
    id: 8,
    questionType: "binary_with_skip",
    primaryDimension: "EA",
    text: "电影的配乐让你印象深刻时，你会怎么做？",
    options: [
      {
        label: "不需要知道为什么好——音乐响起时鸡皮疙瘩起来了就够了",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "会去查是谁配的，用了什么乐器，为什么放在这个场景",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "β", weight: 2 }],
        type: "substantive",
      },
      {
        label: "我很少特别注意电影配乐",
        scores: {},
        hiddenSignals: [{ attribute: "β", weight: -1 }],
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "星际穿越",
          title_en: "Interstellar",
          year: 2014,
          hover: "星际穿越 (Interstellar) · 2014 · 导演: 克里斯托弗·诺兰 · Hans Zimmer 管风琴配乐成为影史经典",
        },
      ],
    },
  },

  // Q9 · 演技判断 (binary)
  {
    id: 9,
    questionType: "binary",
    primaryDimension: "EA",
    text: "你觉得一个演员「演得好」，主要是因为？",
    options: [
      {
        label: "完全忘了他在演——角色变成了一个真实的人",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "能看到他的技术——微表情、口音变化、肢体语言的处理",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "β", weight: 1 }, { attribute: "δ", genre: "drama", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q10 · 女性主义电影 (binary_with_skip) + TMDB
  {
    id: 10,
    questionType: "binary_with_skip",
    primaryDimension: "EA",
    text: "一部获赞的女性主义电影，有人说「太有力量了」，也有人说「太说教了」。你的第一反应是？",
    options: [
      {
        label: "先想知道它讲了一个什么样的女性故事，有没有打动人",
        scores: { E: 1 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "先想知道导演怎么处理这个议题——是靠叙事自然传达，还是直接灌输观点",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "这个话题我没什么特别的想法",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "坠落的审判",
          title_en: "Anatomy of a Fall",
          year: 2023,
          hover: "坠落的审判 (Anatomy of a Fall) · 2023 · 导演: 茹斯汀·特里耶 · 第76届戛纳金棕榈奖",
        },
      ],
    },
  },

  // Q41 · 电影记忆锚点 (multi)
  {
    id: 41,
    questionType: "multi",
    primaryDimension: "EA",
    text: "看完一部电影后，什么会一直留在你脑子里？",
    options: [
      {
        label: "一句台词——某句话钉在脑子里，隔几个月还会突然冒出来",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "一个画面——某个构图、某种光影，像照片一样印在记忆里",
        scores: { E: 0.5, A: 0.5 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "故事结构——某个转折或叙事设计让我忍不住反复回味",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一种氛围——说不上来具体是什么，但整部片的气质一直跟着你",
        scores: { E: 1 },
        type: "substantive",
      },
    ],
  },

  // Q42 · 名场面定义 (multiSelect, maxSelect: 2)
  {
    id: 42,
    questionType: "multiSelect",
    primaryDimension: "EA",
    text: "你心目中的「名场面」是哪一种？（可选 1-2 个）",
    maxSelect: 2,
    options: [
      {
        label: "视觉奇观——震撼到窒息的画面扑面而来",
        scores: { A: 0.5, W: 0.5 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "演员的瞬间——一个眼神、一次嘴角的颤抖，比台词更有力量",
        scores: { E: 1, P: 0.5 },
        type: "substantive",
      },
      {
        label: "导演的签名——特殊的运镜、剪辑或视角一看就知道是谁拍的",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "β", weight: 2 }],
        type: "substantive",
      },
      {
        label: "经典构图——几个人往那一站，画面本身就是一个故事",
        scores: { A: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q51 · 观影环境 (multi, cross-dimension)
  {
    id: 51,
    questionType: "multi",
    primaryDimension: "EA",
    text: "你更享受哪种观影方式？",
    options: [
      {
        label: "去影院——大银幕、全黑环境、和一屋子陌生人一起笑一起屏息",
        scores: { E: 0.5, W: 0.5 },
        type: "substantive",
      },
      {
        label: "窝在家里——沙发、毯子、想暂停就暂停、想倒回去就倒回去",
        scores: { A: 0.5, P: 0.5 },
        type: "substantive",
      },
      {
        label: "取决于片子——大场面去影院，文艺片在家看",
        scores: { X: 0.5 },
        type: "substantive",
      },
      {
        label: "无所谓 / 都行",
        scores: {},
        type: "skip",
      },
    ],
    profileTags: {
      0: "影院原教旨主义者",
      1: "沙发哲学家",
      2: "场景切换大师",
      3: "随遇而安",
    },
  },

  // Q52 · 观影社交 (multi, cross-dimension)
  {
    id: 52,
    questionType: "multi",
    primaryDimension: "EA",
    text: "你更喜欢一个人看电影，还是和别人一起看？",
    options: [
      {
        label: "一个人——可以完全沉浸，不用在意旁边人的反应",
        scores: { E: 0.5, P: 0.5 },
        type: "substantive",
      },
      {
        label: "和朋友或伴侣——看完走出来能立刻讨论，是最爽的部分",
        scores: { A: 0.5 },
        type: "substantive",
      },
      {
        label: "和一群陌生人在满座的影厅里——全场一起笑、一起倒吸冷气",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "都行 / 没有明显偏好",
        scores: {},
        type: "skip",
      },
    ],
    profileTags: {
      0: "独行侠",
      1: "散场话事人",
      2: "集体共振追求者",
      3: "百搭观众",
    },
  },

  // ==================== X/S 维度：拓荒者 vs 考古者（14题）====================

  // Q11 · 被一部好片击中之后 (multi) - 重新设计
  {
    id: 11,
    questionType: "multi",
    primaryDimension: "XS",
    text: "看完一部特别喜欢的电影后，你的'下一步行动'通常是？",
    options: [
      {
        label: "继续追——这部电影有续集吗？系列其他作品有什么？先把整个系列打通",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "扩散搜索——这位演员/导演/编剧在别的电影里怎么样？不同作品间有什么联系",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "沉浸式研究——这部电影好在哪儿？同导演的前作后作有什么变化？逐部细看这个创作者的演变",
        scores: { S: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
      {
        label: "看完就看完了，不一定会专门去找其他作品",
        scores: {},
        type: "skip",
      },
    ],
  },

  // Q12 · 选片轨迹 (binary)
  {
    id: 12,
    questionType: "binary",
    primaryDimension: "XS",
    text: "连续三个周末各看一部电影，你的选片通常会？",
    options: [
      {
        label: "跨度很大——韩国犯罪片、巴西纪录片、法国动画，完全不同方向",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "集中在同一个方向——同一导演或同一类型，一口气看个过瘾",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
  },

  // Q13 · 年代跨度 (binary) + AI placeholder split
  {
    id: 13,
    questionType: "binary",
    primaryDimension: "XS",
    text: "你的片单更接近哪种情况？",
    options: [
      {
        label: "年代跨度很大——从1920年代默片到最近新片，什么年代都有",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "α", weight: 2 }],
        type: "substantive",
      },
      {
        label: "集中在一个年代——那个时期的佳作我几乎都看遍了",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "摩登时代",
          title_en: "Modern Times",
          year: 1936,
          hover: "摩登时代 (Modern Times) · 1936 · 导演: 查理·卓别林 · 默片时代巅峰之作 · 工业文明的经典讽刺",
        },
        {
          title_zh: "信条",
          title_en: "Tenet",
          year: 2020,
          hover: "信条 (Tenet) · 2020 · 导演: 克里斯托弗·诺兰 · 时间逆转概念 · 当代视觉奇观",
        },
      ],
    },
  },

  // Q14 · 电影节态度 (multi) - 增加选项
  {
    id: 14,
    questionType: "multi",
    primaryDimension: "XS",
    text: "电影节放映一堆你完全没听过的片子，你会怎么做？",
    options: [
      {
        label: "这才是电影节的乐趣——如果都是认识的，还去干嘛",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "会挑几部跟「自己方向」相关的，不会全看——时间有限",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "看一些预告和影评后再筛选，避免走冤枉路",
        scores: { S: 0.5, A: 0.5 },
        type: "substantive",
      },
      {
        label: "我没参与过电影节",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "寄生虫",
          title_en: "Parasite",
          year: 2019,
          hover: "寄生虫 (Parasite) · 2019 · 导演: 奉俊昊 · 戛纳金棕榈 + 奥斯卡最佳影片 · 电影节宠儿",
        },
      ],
    },
  },

  // Q15 · 失望后行为 (binary)
  {
    id: 15,
    questionType: "binary",
    primaryDimension: "XS",
    text: "你最喜欢的类型，新出的一部口碑片让你失望了。你会怎么做？",
    options: [
      {
        label: "换换口味——这类型看腻了，正好试试别的",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "回去补早期经典——可能是我还没找到这个类型真正的精华",
        scores: { S: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q16 · 陌生语言电影 (binary_with_skip) + TMDB
  {
    id: 16,
    questionType: "binary_with_skip",
    primaryDimension: "XS",
    text: "一部评价很高的波斯语电影，但你完全不了解伊朗文化。你会？",
    options: [
      {
        label: "好电影自己会说话——文化差异不是障碍，反而是新鲜感",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "γ", weight: 2 }],
        type: "substantive",
      },
      {
        label: "更想在自己熟悉的文化圈里找精品——了解背景能让观影体验更深",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "没兴趣——文化远不远无所谓，就是不想看",
        scores: {},
        hiddenSignals: [{ attribute: "γ", weight: -1 }],
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "一次别离",
          title_en: "A Separation",
          year: 2011,
          hover: "一次别离 (A Separation) · 2011 · 导演: 阿斯哈·法哈蒂 · 奥斯卡最佳外语片 · 柏林金熊奖",
        },
      ],
    },
  },

  // Q17 · 深耕者的价值 (binary)
  {
    id: 17,
    questionType: "binary",
    primaryDimension: "XS",
    text: "有人说「你只看某一类电影，太局限了」，你的反应？",
    options: [
      {
        label: "有道理——电影世界这么大，只待在一个角落确实可惜",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "不认同——在一个领域看到极致，比浅尝辄止十种类型更有价值",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
  },

  // Q18 · 格式探索 (binary)
  {
    id: 18,
    questionType: "binary",
    primaryDimension: "XS",
    text: "除了院线故事片，短片、实验影像、影像装置、VR 电影这些形式你感兴趣吗？",
    options: [
      {
        label: "非常——只要是影像叙事，什么载体我都想试试",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "更专注传统长片——我相信把最经典的形式研究透比什么都重要",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
  },

  // Q19 · 你的选片雷达 (multi)
  {
    id: 19,
    questionType: "multi",
    primaryDimension: "XS",
    text: "你发现新电影主要靠什么渠道？",
    options: [
      {
        label: "到处都能捡到——短视频、公众号、播客、算法推荐，来源越杂发现越多",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "几个固定信任的来源——一两个品味验证过的影评人或博主",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "电影节/颁奖季片单——戛纳、威尼斯、奥斯卡的提名出来就是我的年度选片指南",
        scores: { X: 0.5, A: 0.5 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "朋友和影迷社群——聊天聊出来的、豆瓣小组推荐的，比任何算法都靠谱",
        scores: { S: 0.5, E: 0.5 },
        type: "substantive",
      },
    ],
  },

  // Q20 · 经典必看清单 (multi)
  {
    id: 20,
    questionType: "multi",
    primaryDimension: "XS",
    text: "面对「一生必看的 100 部电影」这种榜单，你的态度？",
    options: [
      {
        label: "当作起点——从榜单出发，往外延伸到榜单没有的角落",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
      {
        label: "当作地图——认真一部一部看完，把每一部都看透再说",
        scores: { S: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
      {
        label: "懒得看——管它什么经典必看，我只看自己当下想看的",
        scores: { X: 0.5 },
        type: "substantive",
      },
    ],
  },

  // Q43 · 全新设计 - 多选题
  {
    id: 43,
    questionType: "multi",
    primaryDimension: "XS",
    text: "如果有人问你'最近在看什么电影'，你最常见的回答是：",
    options: [
      {
        label: "在补某个导演的作品，想把他的风格摸透，比如最近在看贾樟柯的所有电影。",
        scores: { S: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
      {
        label: "没什么特定目标，就是什么好看看什么。最近看了好几部完全不同的。",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "我在追一个话题/美学方向。比如最近对'都市孤独感'这个主题特别感兴趣，所以在找各种表现这个主题的电影。",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "看我心情吧。想看剧情就看剧情，想看爽片就看爽片。",
        scores: { X: 1 },
        type: "substantive",
      },
    ],
  },

  // Q44 · 你的片单有"性别"吗？ (multi)
  {
    id: 44,
    questionType: "multi",
    primaryDimension: "XS",
    text: "互联网把电影分成了「小妞电影」（浪漫、时尚、闺蜜、成长）和「老登电影」（黑帮、权谋、兄弟、硬汉）。看看你自己的片单——",
    options: [
      {
        label: "确实偏「小妞」那边——好看的爱情喜剧和女性成长故事永远看不腻",
        scores: { S: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "δ", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "确实偏「老登」那边——权力游戏和男性世界的暗面对我有致命吸引力",
        scores: { S: 0.5, A: 0.5 },
        type: "substantive",
      },
      {
        label: "两边都看——上午看《穿 Prada 的女魔头》下午看《教父》，完全不矛盾",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "这分法本身就有问题——好电影不需要被性别标签归类",
        scores: { A: 1 },
        type: "substantive",
      },
      {
        label: "我不太了解这些说法",
        scores: {},
        type: "skip",
      },
    ],
  },

  // Q49 · 季节性观影仪式 (multi) + TMDB grid3
  {
    id: 49,
    questionType: "multi",
    primaryDimension: "XS",
    text: "关于「在特定时间看特定电影」这件事，你是？",
    options: [
      {
        label: "有固定仪式——圣诞节看《真爱至上》，春节看喜剧贺岁片，入秋了想看《秋日和》",
        scores: { S: 1, L: 0.5 },
        hiddenSignals: [
          { attribute: "α", weight: 1 },
          { attribute: "δ", genre: "romance", weight: 1 },
          { attribute: "δ", genre: "comedy", weight: 1 },
          { attribute: "δ", genre: "animation", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "没有固定仪式，但会被季节/心情驱动——冬天确实想看暖片，深夜确实想看暗片",
        scores: { E: 0.5, S: 0.5 },
        type: "substantive",
      },
      {
        label: "完全随机——什么时候看什么跟季节没关系",
        scores: { X: 0.5 },
        type: "substantive",
      },
      {
        label: "没想过这个问题",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid3",
      tmdb: [
        {
          title_zh: "真爱至上",
          title_en: "Love Actually",
          year: 2003,
          hover: "真爱至上 · 2003 · 导演: 理查德·柯蒂斯 · 全球圣诞必看电影 No.1",
        },
        {
          title_zh: "小鬼当家",
          title_en: "Home Alone",
          year: 1990,
          hover: "小鬼当家 · 1990 · 导演: 克里斯·哥伦布 · 圣诞+童年回忆双杀",
        },
        {
          title_zh: "天书奇谭",
          title_en: "The Legends of Sealed Book",
          year: 1983,
          hover: "天书奇谭 · 1983 · 上海美术电影制片厂 · 中国动画巅峰之作 · 春节经典回忆",
        },
      ],
    },
  },

  // Q53 · 购票习惯 (multi, cross-dimension)
  {
    id: 53,
    questionType: "multi",
    primaryDimension: "XS",
    text: "你买电影票的风格是？",
    options: [
      {
        label: "提前蹲守型——关注上映日期、研究排片、提前好几天买票选最佳座位",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "临时起意型——今晚想看电影了，打开 app 看看最近的场次有什么",
        scores: { X: 0.5, E: 0.5 },
        type: "substantive",
      },
      {
        label: "口碑等待型——等朋友看完、等豆瓣评分稳定了再决定去不去",
        scores: { A: 0.5, S: 0.5 },
        type: "substantive",
      },
      {
        label: "我基本在线上看，不怎么买电影票",
        scores: {},
        type: "skip",
      },
    ],
    profileTags: {
      0: "首映场占座王",
      1: "随心所欲派",
      2: "口碑鉴定师",
      3: "线上原住民",
    },
  },

  // ==================== P/W 维度：特写镜头 vs 全景镜头（12题）====================

  // Q21 · 故事选择 (multi) - 完全重新设计
  {
    id: 21,
    questionType: "multi",
    primaryDimension: "PW",
    text: "两部电影同时上映，你只能选一部。你走进哪个？",
    options: [
      {
        label: "一对初恋情侣在一个漫长的雨夜里的对话和沉默——整部电影就在一个房间里，你可以看清他们脸上的每一丝表情变化",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "romance", weight: 1 }, { attribute: "δ", genre: "drama", weight: 0.5 }],
        type: "substantive",
      },
      {
        label: "同一对初恋情侣的故事，但跨越整个大学四年，从他们相识、同居、分手到各自成长——每一年一个地点，每个季节一个转折",
        scores: { W: 1 },
        type: "substantive",
      },
      {
        label: "看情绪和最近的心境——心情脆弱时看第一种，想看宏大叙事时选第二种",
        scores: { P: 0.3, W: 0.3 },
        type: "substantive",
      },
      {
        label: "两种都感兴趣 / 看到好评再决定",
        scores: {},
        type: "skip",
      },
    ],
  },

  // Q22 · 持久记忆 (binary)
  {
    id: 22,
    questionType: "binary",
    primaryDimension: "PW",
    text: "一部三年前看的电影，现在还留在脑子里的是什么？",
    options: [
      {
        label: "某个特定的表情、一句台词、一个沉默了五秒的瞬间",
        scores: { P: 1 },
        type: "substantive",
      },
      {
        label: "那个世界的整体质感——氛围、规则、它给你的宏观震撼",
        scores: { W: 1 },
        type: "substantive",
      },
    ],
  },

  // Q23 · 公路电影 (binary) + AI placeholder split
  {
    id: 23,
    questionType: "binary",
    primaryDimension: "PW",
    text: "你理想中的公路电影是什么样的？",
    options: [
      {
        label: "出发时带着一个解不开的心结，终点无所谓——重要的是路上他终于想通了",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "romance", weight: 1 }, { attribute: "δ", genre: "drama", weight: 0.5 }],
        type: "substantive",
      },
      {
        label: "每经过一个地方都是一个新世界——沿途的风景、城镇和陌生人才是真正的主角",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "action", weight: 1 }],
        type: "substantive",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "荒野生存",
          title_en: "Into the Wild",
          year: 2007,
          hover: "荒野生存 (Into the Wild) · 2007 · 导演: 西恩·潘 · 真实故事改编 · 一个人走向阿拉斯加荒野的终极公路片",
        },
        {
          title_zh: "疯狂的麦克斯：狂暴之路",
          title_en: "Mad Max: Fury Road",
          year: 2015,
          hover: "疯狂的麦克斯：狂暴之路 (Mad Max: Fury Road) · 2015 · 导演: 乔治·米勒 · 6项奥斯卡 · 史诗级公路追逐",
        },
      ],
    },
  },

  // Q24 · 群戏 vs 独角戏 (binary)
  {
    id: 24,
    questionType: "binary",
    primaryDimension: "PW",
    text: "你更容易被哪种电影结构吸引？",
    options: [
      {
        label: "一两个核心角色——你有足够时间走进他们的内心深处",
        scores: { P: 1 },
        type: "substantive",
      },
      {
        label: "多线叙事、角色交织——一群人的命运拼出一幅时代群像",
        scores: { W: 1 },
        type: "substantive",
      },
    ],
  },

  // Q25 · 历史题材角度 (binary)
  {
    id: 25,
    questionType: "binary",
    primaryDimension: "PW",
    text: "同一场历史事件，拍成两部电影。你更想看？",
    options: [
      {
        label: "从一个普通人的视角——一封家书、一段日记、一个人的战争",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
      {
        label: "从全景视角——多条战线、多方博弈、整场战争的全貌",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q26 · 科幻切入 (multi) - 重新设计
  {
    id: 26,
    questionType: "multi",
    primaryDimension: "PW",
    text: "你最喜欢哪种科幻电影的切入方式？",
    options: [
      {
        label: "一个人vs宇宙——孤独的宇航员、被困的飞行员，关键词是隔离、自救、内心极限",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "scifi", weight: 1 }],
        type: "substantive",
      },
      {
        label: "全新的世界系统——陌生的行星、陌生的物种、陌生的法则，让我沉浸在完全不同的文明中",
        scores: { W: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "scifi", weight: 1 },
          { attribute: "δ", genre: "action", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "科幻的人性角度——科幻背景下的爱情、家庭、信任问题，比世界观本身更吸引我",
        scores: { P: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "δ", genre: "scifi", weight: 1 }],
        type: "substantive",
      },
      {
        label: "科幻片我不怎么看",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "月球",
          title_en: "Moon",
          year: 2009,
          hover: "月球 (Moon) · 2009 · 导演: 邓肯·琼斯 · 一个人、一个基地、一个关于身份的终极追问",
        },
        {
          title_zh: "沙丘",
          title_en: "Dune",
          year: 2021,
          hover: "沙丘 (Dune) · 2021 · 导演: 丹尼斯·维伦纽瓦 · 弗兰克·赫伯特同名小说改编 · 史诗级世界构建",
        },
      ],
    },
  },

  // Q27 · 性别议题电影 (binary_with_skip)
  {
    id: 27,
    questionType: "binary_with_skip",
    primaryDimension: "PW",
    text: "一部关于性别议题的电影，你更希望它怎么讲？",
    options: [
      {
        label: "聚焦一个人的故事——她的困境、她的觉醒、她不被定义的选择",
        scores: { P: 1 },
        type: "substantive",
      },
      {
        label: "展开一幅全景——制度、文化、代际关系如何共同塑造了今天的处境",
        scores: { W: 1 },
        type: "substantive",
      },
      {
        label: "这类话题不是我看电影时会关注的",
        scores: {},
        type: "skip",
      },
    ],
  },

  // Q28 · 犯罪片的爽感 (multi) + TMDB split
  {
    id: 28,
    questionType: "multi",
    primaryDimension: "PW",
    text: "犯罪电影最让你「爽」的部分是什么？",
    options: [
      {
        label: "角色的堕落弧线——看一个人一步步走向深渊，明知不对但移不开眼",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "drama", weight: 1 }],
        type: "substantive",
      },
      {
        label: "智力博弈——计划、反转、局中局，看谁比谁更聪明",
        scores: { W: 0.5, A: 0.5 },
        hiddenSignals: [{ attribute: "δ", genre: "drama", weight: 1 }],
        type: "substantive",
      },
      {
        label: "系统的暗面——权力怎么运转、钱怎么流动、规则怎么在桌子下面被改写",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "drama", weight: 1 }],
        type: "substantive",
      },
      {
        label: "纯粹的肾上腺素——追车、枪战、千钧一发，就是要那个紧张感",
        scores: { E: 0.5 },
        hiddenSignals: [
          { attribute: "δ", genre: "action", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "犯罪片不是我的菜",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "小丑",
          title_en: "Joker",
          year: 2019,
          hover: "小丑 (Joker) · 2019 · 导演: 托德·菲利普斯 · 威尼斯金狮奖 · 一个被社会边缘化的人的极端蜕变",
        },
        {
          title_zh: "无间道",
          title_en: "Infernal Affairs",
          year: 2002,
          hover: "无间道 (Infernal Affairs) · 2002 · 导演: 刘伟强 / 麦兆辉 · 华语犯罪片巅峰 · 好莱坞翻拍为《无间行者》",
        },
      ],
    },
  },

  // Q29 · 动画电影 (binary_with_skip) + TMDB split
  {
    id: 29,
    questionType: "binary_with_skip",
    primaryDimension: "PW",
    text: "你更被哪种动画电影打动？",
    options: [
      {
        label: "一个生命体的内在旅程——关于成长、失去、和理解「我是谁」",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "animation", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个奇幻世界的宏大冒险——新物种、新法则、一场改变一切的远征",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "animation", weight: 1 }],
        type: "substantive",
      },
      {
        label: "这些电影我没看过",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "心灵奇旅",
          title_en: "Soul",
          year: 2020,
          hover: "心灵奇旅 (Soul) · 2020 · 导演: 彼特·道格特 · 皮克斯 · 奥斯卡最佳动画 · 「生命的火花不是目标，而是活着本身」",
        },
        {
          title_zh: "蜘蛛侠：平行宇宙",
          title_en: "Spider-Man: Into the Spider-Verse",
          year: 2018,
          hover: "蜘蛛侠：平行宇宙 (Spider-Man: Into the Spider-Verse) · 2018 · 导演: 鲍勃·佩尔西凯蒂等 · 奥斯卡最佳动画 · 革命性视觉风格",
        },
      ],
    },
  },

  // Q30 · 结局满足感 (binary)
  {
    id: 30,
    questionType: "binary",
    primaryDimension: "PW",
    text: "一部电影的结局让你满足，通常是因为？",
    options: [
      {
        label: "那个人终于放下了——也许外面什么都没变，但他跟自己和解的那一刻，你的眼眶也热了",
        scores: { P: 1 },
        type: "substantive",
      },
      {
        label: "拼图终于合上了——所有伏线回收、势力洗牌，整个世界在最后五分钟露出全貌",
        scores: { W: 1 },
        type: "substantive",
      },
    ],
  },

  // Q45 · 酷儿电影 (multi) + TMDB grid3
  {
    id: 45,
    questionType: "multi",
    primaryDimension: "PW",
    text: "一部关于同性爱情的电影，你更想看它怎么拍？",
    options: [
      {
        label: "两个人之间的亲密宇宙——不需要宏大叙事，一段感情本身就是全部",
        scores: { P: 1, E: 0.5 },
        hiddenSignals: [
          { attribute: "γ", weight: 1 },
          { attribute: "δ", genre: "romance", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "一个人在身份认同中的漫长挣扎——肤色、性向、阶级交织的内心风暴",
        scores: { P: 1, D: 0.5 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个群体争取被看见的过程——个人故事是整个运动的入口",
        scores: { W: 1 },
        type: "substantive",
      },
      {
        label: "这类题材我没有特别的偏好",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid3",
      tmdb: [
        {
          title_zh: "春光乍泄",
          title_en: "Happy Together",
          year: 1997,
          hover: "春光乍泄 · 1997 · 导演: 王家卫 · 戛纳最佳导演 · 张国荣与梁朝伟的布宜诺斯艾利斯",
        },
        {
          title_zh: "月光男孩",
          title_en: "Moonlight",
          year: 2016,
          hover: "月光男孩 · 2016 · 导演: 巴里·杰金斯 · 奥斯卡最佳影片 · 一个黑人男孩的三段人生",
        },
        {
          title_zh: "米尔克",
          title_en: "Milk",
          year: 2008,
          hover: "米尔克 · 2008 · 导演: 格斯·范·桑特 · 西恩·潘奥斯卡封帝 · 美国首位公开同性恋身份的民选官员",
        },
      ],
    },
  },

  // Q46 · 少数族裔电影 (multi) + TMDB grid3
  {
    id: 46,
    questionType: "multi",
    primaryDimension: "PW",
    text: "一部关于种族或少数群体经历的电影，以下哪种最吸引你？",
    options: [
      {
        label: "一个人的身份觉醒——肤色、血统或出身如何在他身体里制造了一场内战",
        scores: { P: 1, D: 0.5 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个系统的解剖——制度性歧视如何运作，谁在维护它，谁在反抗它",
        scores: { W: 1, A: 0.5 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个文化的自我表达——不以苦难为主题，而是展示一种生活方式本身的质感和骄傲",
        scores: { W: 0.5, L: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "γ", weight: 1 }],
        type: "substantive",
      },
      {
        label: "这个话题我没什么特别的偏好",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid3",
      tmdb: [
        {
          title_zh: "逃出绝命镇",
          title_en: "Get Out",
          year: 2017,
          hover: "逃出绝命镇 · 2017 · 导演: 乔丹·皮尔 · 恐怖片外壳下的种族寓言 · 奥斯卡最佳原创剧本",
        },
        {
          title_zh: "别告诉她",
          title_en: "The Farewell",
          year: 2019,
          hover: "别告诉她 · 2019 · 导演: 王子逸 · 奥卡菲娜主演 · 华裔视角的东西方文化碰撞",
        },
        {
          title_zh: "黑豹",
          title_en: "Black Panther",
          year: 2018,
          hover: "黑豹 · 2018 · 导演: 瑞恩·库格勒 · 漫威首部黑人超级英雄 · 文化现象级事件",
        },
      ],
    },
  },

  // ==================== L/D 维度：柔光 vs 硬光（13题）====================

  // Q31 · 深夜选片 (binary)
  {
    id: 31,
    questionType: "binary",
    primaryDimension: "LD",
    text: "凌晨一点睡不着，你更可能打开？",
    options: [
      {
        label: "一部你知道会让你安心的电影——哪怕已经看过好几遍",
        scores: { L: 1 },
        hiddenSignals: [{ attribute: "α", weight: 1 }],
        type: "substantive",
      },
      {
        label: `一部你一直"没准备好"看的电影——正好，深夜适合硬来`,
        scores: { D: 1 },
        type: "substantive",
      },
    ],
  },

  // Q32 · 喜剧偏好 (multi) + AI placeholder split
  {
    id: 32,
    questionType: "multi",
    primaryDimension: "LD",
    text: "你更喜欢哪种喜剧？",
    options: [
      {
        label: "从头暖到尾——走出影院觉得世界还不错",
        scores: { L: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "笑着笑着就不对劲——黑色幽默、辛辣讽刺，笑完开始反思",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "纯粹的爆笑——不用走心不用反思，全场笑到肚子疼就够了",
        scores: { L: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "δ", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "尬到脚趾抠地——荒诞、冒犯、社死喜剧，笑完浑身不自在",
        scores: { D: 0.5, X: 0.5 },
        hiddenSignals: [{ attribute: "δ", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "我不太看喜剧",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "触不可及",
          title_en: "The Intouchables",
          year: 2011,
          hover: "触不可及 (The Intouchables) · 2011 · 导演: 奥利维·那卡什 / 艾力克·托兰达 · 法国影史票房冠军 · 温暖治愈喜剧",
        },
        {
          title_zh: "龙虾",
          title_en: "The Lobster",
          year: 2015,
          hover: "龙虾 (The Lobster) · 2015 · 导演: 欧格斯·兰斯莫斯 · 戛纳评审团奖 · 荒诞黑色喜剧",
        },
      ],
    },
  },

  // Q33 · 恐怖片关系 (binary)
  {
    id: 33,
    questionType: "binary",
    primaryDimension: "LD",
    text: "你和恐怖片的关系是？",
    options: [
      {
        label: "几乎不看——不是不敢，就是不太享受被恐惧支配的感觉",
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "会主动找来看——从《咒怨》到《中邪》，好的恐怖片提供的心理体验是其他类型给不了的",
        scores: { D: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "horror", weight: 2 },
        ],
        type: "substantive",
      },
    ],
  },

  // Q34 · 道德灰度 (multi) - 选项文案更新
  {
    id: 34,
    questionType: "multi",
    primaryDimension: "LD",
    text: "你更能接受哪种电影主角？",
    options: [
      {
        label: "清晰的善良，但有人性的脆弱——他想做对的事，会失败、会内疚、会遍体鳞伤，但那束良心的光从不熄灭",
        scores: { L: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "romance", weight: 1 }],
        type: "substantive",
      },
      {
        label: "真实的暗面，不自欺不欺人——他清楚自己在做什么、为什么做，那种诚实本身就有致命的魅力",
        scores: { D: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "drama", weight: 1 },
          { attribute: "δ", genre: "horror", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "道德的雾区——每一步都能说出理由，你理解他、甚至会替他开脱，直到最后才发现自己站错了边",
        scores: { L: 0.3, D: 0.3 },
        hiddenSignals: [
          { attribute: "δ", genre: "drama", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "无所谓，主要看故事好不好看",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "阿甘正传",
          title_en: "Forrest Gump",
          year: 1994,
          hover: `阿甘正传 (Forrest Gump) · 1994 · 导演: 罗伯特·泽米吉斯 · 奥斯卡最佳影片 · "生活就像一盒巧克力"`,
        },
        {
          title_zh: "出租车司机",
          title_en: "Taxi Driver",
          year: 1976,
          hover: `出租车司机 (Taxi Driver) · 1976 · 导演: 马丁·斯科塞斯 · 戛纳金棕榈 · "You talkin' to me?"`,
        },
      ],
    },
  },

  // Q35 · 结局偏好 (binary)
  {
    id: 35,
    questionType: "binary",
    primaryDimension: "LD",
    text: "你更享受哪种结局体验？",
    options: [
      {
        label: `故事收束，情感落地——带着一种"圆满"的感觉离开`,
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "故事在一个不安的位置停下——带着一脑子问题走出影院",
        scores: { D: 1 },
        type: "substantive",
      },
    ],
  },

  // Q36 · 暴力呈现 (binary)
  {
    id: 36,
    questionType: "binary",
    primaryDimension: "LD",
    text: "电影中的暴力场景，你的态度是？",
    options: [
      {
        label: "好导演可以用暗示和留白传达同样的力量——不一定要直接呈现",
        scores: { L: 1 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "如果故事需要，直接面对比回避更有冲击力——别替观众做选择",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q37 · 底层叙事 (binary_with_skip) + TMDB split
  {
    id: 37,
    questionType: "binary_with_skip",
    primaryDimension: "LD",
    text: "两部关于底层生活的电影，你更想看？",
    options: [
      {
        label: "苦中有光——在困境里，人与人之间的温情和坚韧",
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "不留退路——系统性的碾压，没有温情滤镜，只有真实的重量",
        scores: { D: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "drama", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "这些电影我没看过",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "小偷家族",
          title_en: "Shoplifters",
          year: 2018,
          hover: `小偷家族 (Shoplifters) · 2018 · 导演: 是枝裕和 · 戛纳金棕榈 · "没有血缘关系的一家人，比真正的家庭更像家"`,
        },
        {
          title_zh: "寄生虫",
          title_en: "Parasite",
          year: 2019,
          hover: "寄生虫 (Parasite) · 2019 · 导演: 奉俊昊 · 戛纳金棕榈 + 奥斯卡最佳影片",
        },
      ],
    },
  },

  // Q38 · 反抗运动 (binary) + AI placeholder
  {
    id: 38,
    questionType: "binary",
    primaryDimension: "LD",
    text: "一部关于反抗运动的电影，你更想看它怎么拍？",
    options: [
      {
        label: "侧重希望和团结——人们如何在压迫中找到力量、彼此支撑",
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "侧重代价和残酷——反抗者付出了什么、失去了什么、最后得到了什么",
        scores: { D: 1 },
        hiddenSignals: [
          { attribute: "δ", genre: "horror", weight: 1 },
        ],
        type: "substantive",
      },
    ],
    image: {
      type: "tmdb",
      layout: "single",
      tmdb: [
        {
          title_zh: "V字仇杀队",
          title_en: "V for Vendetta",
          year: 2005,
          hover: "V字仇杀队 (V for Vendetta) · 2005 · 导演: 詹姆斯·麦克特格 · 经典反乌托邦 · Guy Fawkes面具成为全球反抗符号",
        },
      ],
    },
  },

  // Q39 · 重看被摧毁的体验 (binary)
  {
    id: 39,
    questionType: "binary",
    primaryDimension: "LD",
    text: "一部电影曾让你情绪崩溃。你会再看一遍吗？",
    options: [
      {
        label: "不会——那种被碾压的感觉，经历一次就够了",
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "会——被彻底击碎的体验本身就是一种深刻的存在感，值得再来",
        scores: { D: 1 },
        type: "substantive",
      },
    ],
  },

  // Q40 · 儿童视角 (multi) - 重新设计
  {
    id: 40,
    questionType: "multi",
    primaryDimension: "LD",
    text: "以儿童视角讲故事的电影，你更被哪种吸引？",
    options: [
      {
        label: "儿童世界的魔法感——简单的快乐、天真的冒险、成人早已遗忘的奇迹感",
        scores: { L: 1 },
        hiddenSignals: [
          { attribute: "α", weight: 1 },
          { attribute: "δ", genre: "romance", weight: 1 },
          { attribute: "δ", genre: "comedy", weight: 1 },
          { attribute: "δ", genre: "animation", weight: 0.5 },
        ],
        type: "substantive",
      },
      {
        label: "儿童眼中的真相——大人世界的残酷、谎言和虚伪，通过孩子的视角无所遁形",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "drama", weight: 0.5 }],
        type: "substantive",
      },
      {
        label: "儿童的成长代价——天真在现实中一点点碎裂的过程，既有温情也有痛感",
        scores: { L: 0.5, D: 0.5 },
        type: "substantive",
      },
      {
        label: "不太看这类题材的电影",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "split",
      tmdb: [
        {
          title_zh: "龙猫",
          title_en: "My Neighbor Totoro",
          year: 1988,
          hover: `龙猫 (My Neighbor Totoro) · 1988 · 导演: 宫崎骏 · 吉卜力工作室 · "如果你仔细看，就能看到它们"`,
        },
        {
          title_zh: "佛罗里达乐园",
          title_en: "The Florida Project",
          year: 2017,
          hover: `佛罗里达乐园 (The Florida Project) · 2017 · 导演: 肖恩·贝克 · "在迪士尼世界的阴影下，孩子们制造自己的魔法"`,
        },
      ],
    },
  },

  // Q47 · 硬科幻 vs 软科幻 (multi) + TMDB grid3 - 选项A调整
  {
    id: 47,
    questionType: "multi",
    primaryDimension: "LD",
    text: "关于科幻电影里的「科学」，你的立场是？",
    options: [
      {
        label: "硬科幻才是正道——《火星救援》的种土豆必须有化学依据，科学设定经得起推敲，这才配叫神作",
        scores: { A: 1, D: 0.5 },
        hiddenSignals: [
          { attribute: "β", weight: 1 },
          { attribute: "δ", genre: "scifi", weight: 1 },
          { attribute: "δ", genre: "action", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: `科幻的核心是"幻"不是"科"——《银翼杀手》不需要解释仿生人的技术原理也是神作`,
        scores: { E: 0.5, D: 0.5 },
        hiddenSignals: [
          { attribute: "α", weight: 1 },
          { attribute: "δ", genre: "scifi", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "太空歌剧最带劲——《星球大战》《沙丘》那种，科学设定是舞台，传奇才是主角",
        scores: { E: 0.5, W: 0.5, L: 0.5 },
        hiddenSignals: [
          { attribute: "α", weight: 1 },
          { attribute: "δ", genre: "scifi", weight: 1 },
          { attribute: "δ", genre: "animation", weight: 0.5 },
        ],
        type: "substantive",
      },
      {
        label: "无所谓——只要故事好看就行，我不在乎硬不硬",
        scores: { E: 0.5 },
        hiddenSignals: [{ attribute: "δ", genre: "scifi", weight: 1 }],
        type: "substantive",
      },
      {
        label: "我不怎么看科幻片",
        scores: {},
        hiddenSignals: [{ attribute: "δ", genre: "scifi", weight: -1 }],
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid3",
      tmdb: [
        {
          title_zh: "火星救援",
          title_en: "The Martian",
          year: 2015,
          hover: `火星救援 · 2015 · 导演: 雷德利·斯科特 · NASA 技术顾问全程参与 · "I'm gonna science the shit out of this"`,
        },
        {
          title_zh: "银翼杀手",
          title_en: "Blade Runner",
          year: 1982,
          hover: "银翼杀手 · 1982 · 导演: 雷德利·斯科特 · 赛博朋克美学的开山之作",
        },
        {
          title_zh: "星球大战",
          title_en: "Star Wars",
          year: 1977,
          hover: "星球大战 · 1977 · 导演: 乔治·卢卡斯 · 太空歌剧的定义者 · 改变好莱坞商业模式的作品",
        },
      ],
    },
  },

  // Q48 · 争议电影 (multi) - 改为态度选择题
  {
    id: 48,
    questionType: "multi",
    primaryDimension: "LD",
    text: "面对「争议电影」（因尺度、观点、题材而引发争议的作品），你的态度是？",
    options: [
      {
        label: "被禁就看——越被争议、越被审查，越说明它碰到了什么真实的东西。这种电影往往比安全的艺术作品更有价值",
        scores: { D: 1 },
        type: "substantive",
      },
      {
        label: `有意思就看——不为了"禁"这个标签而看，但如果听说内容有意思，也愿意试试`,
        scores: { D: 0.5 },
        type: "substantive",
      },
      {
        label: "尽量回避——极端的内容和冒犯性的表达，我不认为那就是艺术。温和的批判往往更有力量",
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "无所谓——我看电影看的是故事和情感，不太在乎电影涉不涉及争议",
        scores: { E: 0.5 },
        type: "substantive",
      },
      {
        label: "不看这类题材",
        scores: {},
        type: "skip",
      },
    ],
  },

  // Q50 · 影厅偏好 (multi, no primary dimension)
  {
    id: 50,
    questionType: "multi",
    primaryDimension: "none",
    text: "你去影院看电影时，选的最多的是什么厅？",
    options: [
      {
        label: "IMAX——要看就看最大的，沉浸感第一",
        scores: {},
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "杜比影院 / 杜比全景声——画质和音质都拉满，细节控的天堂",
        scores: {},
        hiddenSignals: [{ attribute: "β", weight: 2 }],
        type: "substantive",
      },
      {
        label: "激光厅 / CGS 中国巨幕——性价比之选，体验比普通厅好不少",
        scores: {},
        hiddenSignals: [{ attribute: "β", weight: 1 }],
        type: "substantive",
      },
      {
        label: "普通厅——看的是电影本身，不是厅",
        scores: {},
        type: "substantive",
      },
      {
        label: "我不太关注厅的类型 / 忘记了",
        scores: {},
        type: "substantive",
      },
      {
        label: "我基本不去影院",
        scores: {},
        type: "substantive",
      },
    ],
    profileTags: {
      0: "巨幕信徒",
      1: "声控画质党",
      2: "性价比玩家",
      3: "内容至上",
      4: "随缘派",
      5: "居家党",
    },
  },

  // Q54 · 动画电影视觉风格 (multi)
  {
    id: 54,
    questionType: "multi",
    primaryDimension: "PW",
    text: "动画电影的视觉表现风格，对你的吸引力有多大？",
    options: [
      {
        label: "2D手绘的温暖感——每一帧都是艺术，线条的力量胜过任何3D特效",
        scores: { P: 1, E: 0.5 },
        hiddenSignals: [
          { attribute: "δ", genre: "animation", weight: 1 },
          { attribute: "β", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "3D+写实渲染的沉浸感——现代技术让虚拟世界和真实无异，这才是动画的未来",
        scores: { W: 1, A: 0.5 },
        hiddenSignals: [
          { attribute: "δ", genre: "animation", weight: 1 },
          { attribute: "β", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "混合风格——日式、欧美、中式各有特色，看故事选风格",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "δ", genre: "animation", weight: 0.5 }],
        type: "substantive",
      },
      {
        label: "风格无所谓，故事好就行",
        scores: { E: 0.5 },
        type: "substantive",
      },
      {
        label: "我不特别关注动画电影",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid3",
      tmdb: [
        {
          title_zh: "千与千寻",
          title_en: "Spirited Away",
          year: 2001,
          hover: "千与千寻 · 2001 · 导演: 宫崎骏 · 手绘动画美学的巅峰 · 奥斯卡最佳动画",
        },
        {
          title_zh: "蜘蛛侠：平行宇宙",
          title_en: "Spider-Man: Into the Spider-Verse",
          year: 2018,
          hover: "蜘蛛侠：平行宇宙 · 2018 · 导演: 鲍勃·佩尔西凯蒂 · 3D动画美学革新",
        },
        {
          title_zh: "你的名字。",
          title_en: "Your Name.",
          year: 2016,
          hover: "你的名字。 · 2016 · 导演: 新海诚 · 日式美学与想象力的结晶",
        },
      ],
    },
  },
];
