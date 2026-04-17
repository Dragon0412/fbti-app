export interface HiddenSignal {
  attribute: "\u03b1" | "\u03b2" | "\u03b3" | "\u03b4";
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

  // Q1 · 观影后反应 (binary)
  {
    id: 1,
    questionType: "binary",
    primaryDimension: "EA",
    text: "看完一部好电影走出影院，你和朋友最可能的对话开场白是？",
    options: [
      {
        label: "\u201c我现在整个人还在那个故事里，先让我缓一缓……\u201d",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "\u201c你注意到第三幕那个叙事转折的处理了吗？\u201d",
        scores: { A: 1 },
        type: "substantive",
      },
    ],
  },

  // Q2 · 推荐方式 (binary)
  {
    id: 2,
    questionType: "binary",
    primaryDimension: "EA",
    text: "朋友让你推荐一部最近看的好片，你的推荐语更可能是？",
    options: [
      {
        label: "\u201c就是那种看完会在回家路上一直想的电影。\u201d",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "\u201c导演用了一种特别聪明的叙事手法，值得研究。\u201d",
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
    text: "你决定重看一部以前看过的电影，通常是因为？",
    options: [
      {
        label: "想再感受一次那种情绪——可能是温暖，可能是心碎",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "上次有个细节一直在脑子里转，想回去验证一个判断",
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
    text: "看一部关于真实灾难的纪录片，最牵动你的是？",
    options: [
      {
        label: "镜头前那些真实人物的面孔和声音",
        scores: { E: 1 },
        hiddenSignals: [
          { attribute: "\u03b4", genre: "documentary", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "导演选择了展示什么、隐藏什么——素材的剪辑和立场",
        scores: { A: 1 },
        hiddenSignals: [
          { attribute: "\u03b2", weight: 1 },
          { attribute: "\u03b4", genre: "documentary", weight: 1 },
        ],
        type: "substantive",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "single",
      aiPrompts: [
        {
          position: "single",
          prompt:
            "A cinematic still from a war documentary film, shot on 16mm film stock with visible grain. Close-up of weathered hands holding a faded photograph, shallow depth of field, muted desaturated color palette with warm skin tones against cold blue-gray background.",
        },
      ],
    },
  },

  // Q5 · "技术好但冷" 的取舍 (binary)
  {
    id: 5,
    questionType: "binary",
    primaryDimension: "EA",
    text: "一部电影的摄影和剪辑堪称完美，但你全程没有任何情感波动。你怎么评价？",
    options: [
      {
        label: "遗憾——再精湛的技术，如果打动不了人，就差了最关键的东西",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "佩服——好电影不一定要煽情，纯粹的形式美本身就是一种极致",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q6 · 争议片立场 (binary)
  {
    id: 6,
    questionType: "binary",
    primaryDimension: "EA",
    text: "一部豆瓣评分 6.8 的电影，你看完觉得它不好。你的\u201c不好\u201d更接近？",
    options: [
      {
        label: "\u201c看完之后什么感觉都没有——它没有碰到我。\u201d",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "\u201c叙事逻辑有硬伤，角色动机不自洽，主题表达太浅。\u201d",
        scores: { A: 1 },
        type: "substantive",
      },
    ],
  },

  // Q7 · 恐怖片状态 (binary) + AI placeholder
  {
    id: 7,
    questionType: "binary",
    primaryDimension: "EA",
    text: "看恐怖片的时候，你的状态更接近？",
    options: [
      {
        label: "身体比脑子先反应——手心出汗、屏住呼吸，被氛围完全裹着走",
        scores: { E: 1 },
        hiddenSignals: [
          { attribute: "\u03b4", genre: "horror", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "大脑比身体先反应——\u201c这个 jump scare 的节奏设计得真精准\u201d",
        scores: { A: 1 },
        hiddenSignals: [
          { attribute: "\u03b4", genre: "horror", weight: 1 },
        ],
        type: "substantive",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "single",
      aiPrompts: [
        {
          position: "single",
          prompt:
            "A moody cinematic still evoking psychological horror atmosphere. A long dimly-lit corridor in an old building, single flickering fluorescent light casting harsh shadows.",
        },
      ],
    },
  },

  // Q8 · 配乐感知 (binary_with_skip) + TMDB
  {
    id: 8,
    questionType: "binary_with_skip",
    primaryDimension: "EA",
    text: "一部电影的配乐让你印象深刻，你的反应更可能是？",
    options: [
      {
        label: "不需要知道\u201c为什么好\u201d——音乐响起的那一刻，鸡皮疙瘩就是答案",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "去查这是谁的配乐，用了什么乐器编制，为什么选在这个场景",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 2 }],
        type: "substantive",
      },
      {
        label: "我很少特别注意电影配乐",
        scores: {},
        hiddenSignals: [{ attribute: "\u03b2", weight: -1 }],
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
    text: "你觉得一个演员\u201c演得好\u201d，通常是因为？",
    options: [
      {
        label: "你忘了他在演——那个角色变成了一个活生生的人",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "你看到了他的技术选择——某个微表情、某处口音变化、某段肢体语言",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q10 · 女性主义电影 (binary_with_skip) + TMDB
  {
    id: 10,
    questionType: "binary_with_skip",
    primaryDimension: "EA",
    text: "一部获的女性主义电影，有人称赞\u201c太有力量了\u201d，也有人批评\u201c太说教了\u201d。你的第一反应？",
    options: [
      {
        label: "先想知道它讲了一个什么样的女性故事，有没有打动人",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "先想知道导演怎么处理这个议题——是靠叙事自然传达，还是直接给观点",
        scores: { A: 1 },
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
    text: "一部电影看完之后留在你脑子里的，通常是什么？",
    options: [
      {
        label: "一句台词——某句话钉在脑子里，隔几个月还会突然冒出来",
        scores: { E: 1 },
        type: "substantive",
      },
      {
        label: "一个画面——某个构图、某种光影，像一张照片刻在记忆里",
        scores: { E: 0.5, A: 0.5 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一段叙事——故事的结构或某个转折让你忍不住反复回味",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一种氛围——说不清具体是什么，但整部电影的\u201c气质\u201d一直跟着你",
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
    text: "你心目中的\u201c名场面\u201d，是什么样的？（可选 1-2 个）",
    maxSelect: 2,
    options: [
      {
        label: "视觉奇观——震撼到窒息的画面扑面而来，像太空电梯升空、千军万马长镜头那种",
        scores: { A: 0.5, W: 0.5 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
      {
        label: "演员的瞬间——一个眼神、一次嘴角的颤抖，比一万句台词都有力量",
        scores: { E: 1, P: 0.5 },
        type: "substantive",
      },
      {
        label: "导演的签名手法——某种特殊的运镜、剪辑或视角，看到就知道是谁拍的",
        scores: { A: 1 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 2 }],
        type: "substantive",
      },
      {
        label: "经典构图/站位——几个人站在那里，画面本身就是一切",
        scores: { A: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
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

  // Q11 · 被一部好片击中之后 (binary)
  {
    id: 11,
    questionType: "binary",
    primaryDimension: "XS",
    text: "刚看完一部特别喜欢的电影，你更可能做什么？",
    options: [
      {
        label: "顺藤摸瓜——这导演还拍过什么？演员还演过什么？配乐是谁做的？一路挖下去",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "锁定这个导演——翻出他的片单，一部一部往回补，补完再说",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
  },

  // Q12 · 选片轨迹 (binary)
  {
    id: 12,
    questionType: "binary",
    primaryDimension: "XS",
    text: "连续三个周末各选一部电影看，你的选片轨迹更可能是？",
    options: [
      {
        label: "一部韩国犯罪片、一部巴西纪录片、一部法国动画——完全不同方向",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
        type: "substantive",
      },
      {
        label: "三部都在你最近迷上的同一个方向里——同一个导演或同一个子类型",
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
    text: "以下两种片单，哪个更像你的？",
    options: [
      {
        label: "从 1920 年代默片到 2024 年新片都有——跨越一百年",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 2 }],
        type: "substantive",
      },
      {
        label: "集中在你最了解的那个年代，但那个年代的佳作你几乎看遍了",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "split",
      aiPrompts: [
        {
          position: "left",
          prompt:
            "A nostalgic 1920s silent film era aesthetic. Black and white image with heavy film grain and scratches, showing a vintage movie projector beam cutting through dusty air in an old cinema.",
        },
        {
          position: "right",
          prompt:
            "A modern digital cinema aesthetic. Crystal clear 4K resolution image of a contemporary movie theater screen glowing in darkness, showing a vibrant colorful scene.",
        },
      ],
    },
  },

  // Q14 · 电影节态度 (binary) + AI placeholder
  {
    id: 14,
    questionType: "binary",
    primaryDimension: "XS",
    text: "一个电影节放映一堆你完全没听过的片子。你的反应？",
    options: [
      {
        label: "这就是电影节的意义——如果都是我认识的，还去干嘛",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
        type: "substantive",
      },
      {
        label: "会挑几部跟自己方向相关的，不会无差别扫片——时间有限",
        scores: { S: 1 },
        type: "substantive",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "single",
      aiPrompts: [
        {
          position: "single",
          prompt:
            "An atmospheric photograph of a film festival venue at dusk. Red carpet leading to an art deco cinema entrance, warm golden light spilling from inside.",
        },
      ],
    },
  },

  // Q15 · 失望后行为 (binary)
  {
    id: 15,
    questionType: "binary",
    primaryDimension: "XS",
    text: "你最喜欢的类型里，一部新出的口碑佳作让你失望了。你更可能？",
    options: [
      {
        label: "换换口味——这类型看腻了，正好试试别的",
        scores: { X: 1 },
        type: "substantive",
      },
      {
        label: "回去补更早期的经典——可能是我还没找到这个类型真正的精华",
        scores: { S: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q16 · 陌生语言电影 (binary_with_skip) + TMDB
  {
    id: 16,
    questionType: "binary_with_skip",
    primaryDimension: "XS",
    text: "一部评价很高的波斯语电影，你完全不了解伊朗文化。你的反应？",
    options: [
      {
        label: "好电影自己会说话——文化差异不是障碍，反而是新鲜感",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "\u03b3", weight: 2 }],
        type: "substantive",
      },
      {
        label: "更想在自己熟悉的文化圈里找精品——理解背景能让观影体验更深",
        scores: { S: 1 },
        type: "substantive",
      },
      {
        label: "没兴趣——跟文化远不远没关系，就是不想看",
        scores: {},
        hiddenSignals: [{ attribute: "\u03b3", weight: -1 }],
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
    text: "有人说\u201c你只看某一类电影，太局限了\u201d，你的反应？",
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
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
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
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
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
    text: "面对\u201c一生必看的 100 部电影\u201d这种榜单，你的态度？",
    options: [
      {
        label: "当作起点——从榜单出发，往外延伸到榜单没有的角落",
        scores: { X: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "当作地图——认真一部一部看完，把每一部都看透再说",
        scores: { S: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "懒得看——管它什么经典必看，我只看自己当下想看的",
        scores: { X: 0.5 },
        type: "substantive",
      },
    ],
  },

  // Q43 · 豆瓣华语 TOP 10 (multiSelect, maxSelect: 2) + TMDB grid4
  {
    id: 43,
    questionType: "multiSelect",
    primaryDimension: "XS",
    text: "以下是豆瓣 Top 250 中排名最高的四部华语电影，哪部最让你有共鸣？（可选 1-2 个）",
    maxSelect: 2,
    options: [
      {
        label: "\u300a霸王别姬\u300b——一个人、一出戏、一个时代的倒塌（豆瓣 9.6，华语片第一）",
        scores: { S: 1, E: 0.5 },
        type: "substantive",
      },
      {
        label: "\u300a活着\u300b——富贵一辈子什么都没了，但他还活着（豆瓣 9.3，张艺谋巅峰）",
        scores: { S: 0.5, P: 0.5, D: 0.5 },
        type: "substantive",
      },
      {
        label: "\u300a大话西游之大圣娶亲\u300b——年轻时觉得搞笑，长大了才知道是悲剧（豆瓣 9.2，cult 经典）",
        scores: { X: 0.5, E: 0.5, L: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "\u300a让子弹飞\u300b——\u201c站着，还把钱给挣了\u201d，姜文最爽的一次（豆瓣 9.0，类型片天花板）",
        scores: { X: 0.5, A: 0.5 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
      {
        label: "这几部都没怎么看过",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid4",
      tmdb: [
        {
          title_zh: "霸王别姬",
          title_en: "Farewell My Concubine",
          year: 1993,
          hover: "霸王别姬 · 1993 · 导演: 陈凯歌 · 戛纳金棕榈 · 豆瓣 9.6 · 华语电影影史第一",
        },
        {
          title_zh: "活着",
          title_en: "To Live",
          year: 1994,
          hover: "活着 · 1994 · 导演: 张艺谋 · 戛纳评审团大奖 · 余华同名小说改编 · 大陆未公映",
        },
        {
          title_zh: "大话西游之大圣娶亲",
          title_en: "A Chinese Odyssey Part Two",
          year: 1995,
          hover: "大话西游 · 1995 · 导演: 刘镇伟 · 上映时票房惨败 · 后成华语电影最大 cult 经典",
        },
        {
          title_zh: "让子弹飞",
          title_en: "Let the Bullets Fly",
          year: 2010,
          hover: "让子弹飞 · 2010 · 导演: 姜文 · 票房 6.7 亿 · \u201c你给我翻译翻译，什么叫惊喜\u201d",
        },
      ],
    },
  },

  // Q44 · 你的片单有"性别"吗？ (multi)
  {
    id: 44,
    questionType: "multi",
    primaryDimension: "XS",
    text: "互联网把电影分成了\u201c小妞电影\u201d（浪漫、时尚、闺蜜、成长）和\u201c老登电影\u201d（黑帮、权谋、兄弟、硬汉）。看看你自己的片单——",
    options: [
      {
        label: "确实偏\u201c小妞\u201d那边——好看的爱情喜剧和女性成长故事永远看不腻",
        scores: { S: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "确实偏\u201c老登\u201d那边——权力游戏和男性世界的暗面对我有致命吸引力",
        scores: { S: 0.5, A: 0.5 },
        type: "substantive",
      },
      {
        label: "两边都看——上午看\u300a穿 Prada 的女魔头\u300b下午看\u300a教父\u300b，完全不矛盾",
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
    text: "关于\u201c在特定时间看特定电影\u201d这件事，你是？",
    options: [
      {
        label: "有固定仪式——圣诞节看\u300a真爱至上\u300b，春节看喜剧贺岁片，入秋了想看\u300a秋日和\u300b",
        scores: { S: 1, L: 0.5 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
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
          title_en: "Legends of Sealed Book",
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

  // Q21 · 故事选择 (binary)
  {
    id: 21,
    questionType: "binary",
    primaryDimension: "PW",
    text: "两部电影同时上映，你只能选一部。你走进哪个？",
    options: [
      {
        label: "一个中年女人在母亲去世后独自整理遗物的周末",
        scores: { P: 1 },
        type: "substantive",
      },
      {
        label: "一个帝国在三代人的时间里从崛起走向崩溃",
        scores: { W: 1 },
        type: "substantive",
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
        type: "substantive",
      },
      {
        label: "每经过一个地方都是一个新世界——沿途的风景、城镇和陌生人才是真正的主角",
        scores: { W: 1 },
        type: "substantive",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "split",
      aiPrompts: [
        {
          position: "left",
          prompt:
            "A cinematic still from an introspective road movie. A lone figure sitting on the hood of a dusty old car parked at the side of a vast empty highway at golden hour, gazing into the distance.",
        },
        {
          position: "right",
          prompt:
            "A cinematic aerial shot from an epic road movie. A winding mountain road cutting through dramatically diverse landscapes—desert transitioning to forest to coastal cliffs—with a tiny vehicle traversing it.",
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
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "从全景视角——多条战线、多方博弈、整场战争的全貌",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
    ],
  },

  // Q26 · 科幻切入 (binary_with_skip) + TMDB split
  {
    id: 26,
    questionType: "binary_with_skip",
    primaryDimension: "PW",
    text: "你理想中的科幻电影是？",
    options: [
      {
        label: "外太空只是内心的隐喻——一个人在极端环境中面对孤独、记忆和自我",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "scifi", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个全新的文明——全新的物理法则、社会结构、你从未想象过的世界",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "scifi", weight: 1 }],
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
    text: "犯罪电影最让你\u201c爽\u201d的部分是什么？",
    options: [
      {
        label: "角色的堕落弧线——看一个人一步步走向深渊，明知不对但移不开眼",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "crime", weight: 1 }],
        type: "substantive",
      },
      {
        label: "智力博弈——计划、反转、局中局，看谁比谁更聪明",
        scores: { W: 0.5, A: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "crime", weight: 1 }],
        type: "substantive",
      },
      {
        label: "系统的暗面——权力怎么运转、钱怎么流动、规则怎么在桌子下面被改写",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "crime", weight: 1 }],
        type: "substantive",
      },
      {
        label: "纯粹的肾上腺素——追车、枪战、千钧一发，就是要那个紧张感",
        scores: { E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "crime", weight: 1 }],
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
          hover: "无间道 (Infernal Affairs) · 2002 · 导演: 刘伟强 / 麦兆辉 · 华语犯罪片巅峰 · 好莱坞翻拍为\u300a无间行者\u300b",
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
        label: "一个生命体的内在旅程——关于成长、失去、和理解\u201c我是谁\u201d",
        scores: { P: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "animation", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个奇幻世界的宏大冒险——新物种、新法则、一场改变一切的远征",
        scores: { W: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "animation", weight: 1 }],
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
          hover: "心灵奇旅 (Soul) · 2020 · 导演: 彼特·道格特 · 皮克斯 · 奥斯卡最佳动画 · \u201c生命的火花不是目标，而是活着本身\u201d",
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
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个人在身份认同中的漫长挣扎——肤色、性向、阶级交织的内心风暴",
        scores: { P: 1, D: 0.5 },
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
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个系统的解剖——制度性歧视如何运作，谁在维护它，谁在反抗它",
        scores: { W: 1, A: 0.5 },
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
        type: "substantive",
      },
      {
        label: "一个文化的自我表达——不以苦难为主题，而是展示一种生活方式本身的质感和骄傲",
        scores: { W: 0.5, L: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
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
        type: "substantive",
      },
      {
        label: "一部你一直\u201c没准备好\u201d看的电影——正好，深夜适合硬来",
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
        hiddenSignals: [{ attribute: "\u03b4", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "笑着笑着就不对劲——黑色幽默、辛辣讽刺，笑完开始反思",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "纯粹的爆笑——不用走心不用反思，全场笑到肚子疼就够了",
        scores: { L: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "尬到脚趾抠地——荒诞、冒犯、社死喜剧，笑完浑身不自在",
        scores: { D: 0.5, X: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "comedy", weight: 1 }],
        type: "substantive",
      },
      {
        label: "我不太看喜剧",
        scores: {},
        type: "skip",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "split",
      aiPrompts: [
        {
          position: "left",
          prompt:
            "A warm, sunlit still from a feel-good comedy film. Two friends laughing on a park bench in golden hour light, lens flare softly bleeding into frame. Saturated warm color palette.",
        },
        {
          position: "right",
          prompt:
            "A darkly comedic cinematic still. A man in a suit sitting alone at a lavish dinner table, perfectly composed but with something subtly wrong. Desaturated color palette with sickly green undertones.",
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
        label: "会主动找来看——从\u300a咒怨\u300b到\u300a中邪\u300b，好的恐怖片提供的心理体验是其他类型给不了的",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "horror", weight: 2 }],
        type: "substantive",
      },
    ],
  },

  // Q34 · 道德灰度 (binary_with_skip) + TMDB split
  {
    id: 34,
    questionType: "binary_with_skip",
    primaryDimension: "LD",
    text: "你更能接受哪种电影主角？",
    options: [
      {
        label: "有裂缝的好人——他会犯错、会软弱，但你看到他心底那束光就觉得值了",
        scores: { L: 1 },
        type: "substantive",
      },
      {
        label: "迷人的灰色——你知道他不是好人，但他的每一步你都理解，甚至差点站在他那边",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "这些电影我没看过",
        scores: {},
        hiddenSignals: [{ attribute: "\u03b1", weight: -1 }],
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
          hover: "阿甘正传 (Forrest Gump) · 1994 · 导演: 罗伯特·泽米吉斯 · 奥斯卡最佳影片 · \u201c生活就像一盒巧克力\u201d",
        },
        {
          title_zh: "出租车司机",
          title_en: "Taxi Driver",
          year: 1976,
          hover: "出租车司机 (Taxi Driver) · 1976 · 导演: 马丁·斯科塞斯 · 戛纳金棕榈 · \u201cYou talkin' to me?\u201d",
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
        label: "故事收束，情感落地——带着一种\u201c圆满\u201d的感觉离开",
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
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
      {
        label: "如果故事需要，直接面对比回避更有冲击力——别替观众做选择",
        scores: { D: 1 },
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
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
          hover: "小偷家族 (Shoplifters) · 2018 · 导演: 是枝裕和 · 戛纳金棕榈 · \u201c没有血缘关系的一家人，比真正的家庭更像家\u201d",
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
        type: "substantive",
      },
    ],
    image: {
      type: "ai_placeholder",
      layout: "single",
      aiPrompts: [
        {
          position: "single",
          prompt:
            "A powerful cinematic still depicting a resistance movement. A crowd of silhouetted figures marching forward on a wide street at dawn, backlit by a rising sun breaking through smoke or haze.",
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

  // Q40 · 儿童视角 (binary_with_skip) + TMDB split
  {
    id: 40,
    questionType: "binary_with_skip",
    primaryDimension: "LD",
    text: "你更喜欢哪种\u201c用孩子的眼睛看世界\u201d的电影？",
    options: [
      {
        label: "世界在孩子眼里是有魔法的——后院能通向另一个宇宙，雨天是探险日",
        scores: { L: 1 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "大人的谎言在孩子面前无处遁形——他们不理解\u201c规则\u201d，所以能看见每一道裂缝",
        scores: { D: 1 },
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
          title_zh: "龙猫",
          title_en: "My Neighbor Totoro",
          year: 1988,
          hover: "龙猫 (My Neighbor Totoro) · 1988 · 导演: 宫崎骏 · 吉卜力工作室 · \u201c如果你仔细看，就能看到它们\u201d",
        },
        {
          title_zh: "佛罗里达乐园",
          title_en: "The Florida Project",
          year: 2017,
          hover: "佛罗里达乐园 (The Florida Project) · 2017 · 导演: 肖恩·贝克 · \u201c在迪士尼世界的阴影下，孩子们制造自己的魔法\u201d",
        },
      ],
    },
  },

  // Q47 · 硬科幻 vs 软科幻 (multi) + TMDB grid3
  {
    id: 47,
    questionType: "multi",
    primaryDimension: "LD",
    text: "关于科幻电影里的\u201c科学\u201d，你的立场是？",
    options: [
      {
        label: "硬科幻才是正道——\u300a火星救援\u300b的种土豆必须有化学依据，\u300a三体\u300b的物理设定必须经得起推敲",
        scores: { A: 1, D: 0.5 },
        hiddenSignals: [
          { attribute: "\u03b2", weight: 1 },
          { attribute: "\u03b4", genre: "scifi", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "科幻的核心是\u201c幻\u201d不是\u201c科\u201d——\u300a银翼杀手\u300b不需要解释仿生人的技术原理也是神作",
        scores: { E: 0.5, D: 0.5 },
        hiddenSignals: [
          { attribute: "\u03b1", weight: 1 },
          { attribute: "\u03b4", genre: "scifi", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "太空歌剧最带劲——\u300a星球大战\u300b\u300a沙丘\u300b那种，科学设定是舞台，传奇才是主角",
        scores: { E: 0.5, W: 0.5, L: 0.5 },
        hiddenSignals: [
          { attribute: "\u03b1", weight: 1 },
          { attribute: "\u03b4", genre: "scifi", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "无所谓——只要故事好看就行，我不在乎硬不硬",
        scores: { E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b4", genre: "scifi", weight: 1 }],
        type: "substantive",
      },
      {
        label: "我不怎么看科幻片",
        scores: {},
        hiddenSignals: [{ attribute: "\u03b4", genre: "scifi", weight: -1 }],
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
          hover: "火星救援 · 2015 · 导演: 雷德利·斯科特 · NASA 技术顾问全程参与 · \u201cI'm gonna science the shit out of this\u201d",
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

  // Q48 · 争议/禁片 (multi) + TMDB grid4
  {
    id: 48,
    questionType: "multi",
    primaryDimension: "LD",
    text: "以下哪部\u201c争议电影\u201d你最想看（或最让你着迷）？",
    options: [
      {
        label: "\u300a色，戒\u300b——李安把情欲拍成了政治武器，每一场床戏都是权力博弈",
        scores: { D: 1, E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b3", weight: 1 }],
        type: "substantive",
      },
      {
        label: "\u300a发条橙\u300b——库布里克把暴力拍成了美学，50 年后依然让人不安",
        scores: { D: 1, A: 0.5 },
        hiddenSignals: [
          { attribute: "\u03b1", weight: 1 },
          { attribute: "\u03b2", weight: 1 },
        ],
        type: "substantive",
      },
      {
        label: "\u300a颐和园\u300b——娄烨拍出了一代人的身体和精神创伤，至今无法在大陆公映",
        scores: { D: 0.5, P: 0.5, E: 0.5 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "\u300a索多玛 120 天\u300b——帕索里尼用极端影像控诉法西斯，大部分人看不完",
        scores: { D: 1.5 },
        hiddenSignals: [{ attribute: "\u03b1", weight: 1 }],
        type: "substantive",
      },
      {
        label: "这类电影我不感兴趣 / 都没看过",
        scores: { L: 0.5 },
        type: "skip",
      },
    ],
    image: {
      type: "tmdb",
      layout: "grid4",
      tmdb: [
        {
          title_zh: "色，戒",
          title_en: "Lust, Caution",
          year: 2007,
          hover: "色，戒 · 2007 · 导演: 李安 · 威尼斯金狮奖 · 大陆上映删减约 7 分钟",
        },
        {
          title_zh: "发条橙",
          title_en: "A Clockwork Orange",
          year: 1971,
          hover: "发条橙 · 1971 · 导演: 库布里克 · 在英国被导演本人主动撤回长达 27 年",
        },
        {
          title_zh: "颐和园",
          title_en: "Summer Palace",
          year: 2006,
          hover: "颐和园 · 2006 · 导演: 娄烨 · 因未经审批参加戛纳，导演被禁拍五年",
        },
        {
          title_zh: "索多玛120天",
          title_en: "Salò",
          year: 1975,
          hover: "索多玛120天 · 1975 · 导演: 帕索里尼 · 导演在上映前被谋杀 · 多国至今禁映",
        },
      ],
    },
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
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
        type: "substantive",
      },
      {
        label: "杜比影院 / 杜比全景声——画质和音质都拉满，细节控的天堂",
        scores: {},
        hiddenSignals: [{ attribute: "\u03b2", weight: 2 }],
        type: "substantive",
      },
      {
        label: "激光厅 / CGS 中国巨幕——性价比之选，体验比普通厅好不少",
        scores: {},
        hiddenSignals: [{ attribute: "\u03b2", weight: 1 }],
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
];
