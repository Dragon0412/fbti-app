# FBTI — Film Buff Type Indicator · 影迷类型指标

> 每个人都是一座电影院。快速版 25 题 / 完整版 54 题，发现你的电影人格类型。

网站：https://www.fbti.fan

FBTI 是一个受 MBTI 启发的电影人格测试应用。通过精心设计的影视问卷，将用户映射到 **16 种独特的电影人格原型**，并生成个性化的导演 & 电影推荐、观影画像和隐藏属性分析。

## * 核心特性

### 16 种电影人格
基于四大维度组合出 16 种人格原型，分为 **E 系（共情流）** 和 **A 系（拆片流）** 两大阵营：

| 维度 | 左极 | 右极 | 含义 |
|------|------|------|------|
| **EA** | 共情流 (E) | 拆片流 (A) | 感知模式 — 你用情感还是理性看电影？ |
| **XS** | 拓荒探险 (X) | 深度深耕 (S) | 探索方式 — 你追求新鲜还是深度？ |
| **PW** | 微光私人 (P) | 广角宏大 (W) | 叙事引力 — 你偏好个体故事还是宏大叙事？ |
| **LD** | 向阳温暖 (L) | 逐暗深刻 (D) | 影调趋向 — 你喜欢明亮还是暗黑？ |

> 例如：**EXPL 宝藏猎人** — 用共情感知新世界，偏爱温暖的私人叙事。

### 隐藏属性系统
除主维度外，还有三项深层观影特质（α / β / γ）和一项类型基因（δ）：

- **α 影史沙漏** — 你看的电影跨越了多大的时间长河？
- **β 观影质感** — 你对不同艺术风格的包容度如何？
- **γ 世界公民指数** — 你对国际多元电影的开放程度？
- **δ 类型基因** — 你在恐怖、喜剧、科幻、爱情、动作、剧情、动画七大类型中的偏好雷达图。

每项属性映射到 4 个稀有度等级：`Common → Uncommon → Rare → Legendary`。

### 个性化推荐
根据用户的隐藏属性归一化权重，从内置导演 & 电影元数据库中智能匹配，输出最贴合你观影口味的推荐列表。

### Apple 风格翻页动效
基于 framer-motion 实现全站翻页交互，采用自定义 cubic-bezier 缓动曲线，支持多种翻页方式：按钮点击、鼠标滚轮、触控板、手势滑动、键盘方向键。

### 撕票根揭晓动画
结果页首屏采用 CSS 动画 + 粒子特效，模拟电影票撕开的揭晓效果。

### 分享卡片一键生成
基于 modern-screenshot 将结果截图为 PNG 图片，移动端长按保存、桌面端右键保存。

### 海报墙视频背景
豆瓣 Top200 电影海报滚动视频作为全局背景，营造沉浸式影院氛围。

### 全站统计数据可视化
实时聚合全站用户数据，展示人格分布柱状图、类型基因热力条、稀有度堆叠条等群体洞察。

### Google AdSense 广告集成
全站接入 Google AdSense，支持自适应广告位。

## * 测试模式

| 模式 | 题量 | 说明 |
|------|------|------|
| 快速版 | 25 题 | 核心维度精选题 + 权重补偿算法 |
| 完整版 | 54 题 | 全量题库，含观影画像题（Q50-Q53） |

## * 技术栈

- **框架** — [Next.js](https://nextjs.org/) 16.2.4 (App Router)
- **语言** — TypeScript
- **UI** — React 19.2.4 + Tailwind CSS 4
- **动效** — framer-motion 12（翻页动效）
- **截图** — modern-screenshot 4（分享卡片生成）
- **图片处理** — sharp（图片/视频处理）
- **字体** — Playfair Display / Inter / Noto Serif SC / Noto Sans SC（via `next/font`）
- **数据** — 本地 JSON + 文件系统持久化统计
- **部署** — Vercel / Node.js

## * 项目结构

```
fbti-app/
├── app/
│   ├── page.tsx              # 首页 — 测试入口
│   ├── quiz/page.tsx         # 答题页 — 动态问卷交互
│   ├── result/page.tsx       # 结果页 — 人格展示 & 推荐
│   ├── encyclopedia/page.tsx # 百科 — 16 型图鉴
│   ├── stats/page.tsx        # 全站统计页
│   └── api/stats/            # 统计 API（GET / POST）
├── components/
│   ├── StatsPreview.tsx      # 首页统计摘要
│   ├── PosterWall.tsx        # 海报墙视频背景组件
│   ├── PosterOpacityController.tsx # 视频透明度控制
│   └── Tooltip.tsx           # 通用提示框
├── data/
│   ├── questions.ts          # 54 题完整题库
│   ├── types.ts              # 16 种人格类型定义
│   ├── directorsMeta.ts      # 导演 & 电影元数据
│   ├── posterMap.ts          # 海报本地映射
│   ├── doubanTop100.ts       # 豆瓣 Top100 电影数据
│   ├── doubanTop200.ts       # 豆瓣 101-200 电影数据
│   └── stats.json            # 运行时统计数据
├── scripts/                  # 海报爬取和视频生成脚本
├── utils/
│   ├── calculator.ts         # 核心计算引擎
│   ├── stats-store.ts        # 统计读写 & 缓存
│   └── tmdb.ts               # TMDB API 工具
└── public/posters/           # 电影海报资源
```

## * 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可体验。

## * License

MIT
