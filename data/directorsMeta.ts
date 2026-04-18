// Director metadata for personalized selection
// era: 1=classic(pre-1970), 2=mid(1970-2000), 3=contemporary(2000+)
// style: 0=naturalist/story, 1=formalist/technical
// diversity: 0=mainstream Hollywood, 1=international/indie
export interface DirectorMeta {
  name: string;
  era: number;
  style: number;
  diversity: number;
  genres: string[];
}

export interface FilmMeta {
  title: string;
  year: number;
  director: string;
  style: number; // 0=naturalist, 1=formalist
  genres: string[];
}

// Metadata for all directors across all personality types
export const directorsMeta: Record<string, DirectorMeta> = {
  // EXPL 宝藏猎人 - 新锐独立导演
  "是枝裕和": { name: "是枝裕和", era: 3, style: 0, diversity: 1, genres: ["剧情", "家庭"] },
  "阿巴斯·基亚罗斯塔米": { name: "阿巴斯·基亚罗斯塔米", era: 2, style: 0.3, diversity: 1, genres: ["剧情", "纪录片"] },
  "阿基·考里斯马基": { name: "阿基·考里斯马基", era: 2, style: 0.2, diversity: 1, genres: ["剧情", "喜剧"] },
  "侯孝贤": { name: "侯孝贤", era: 2, style: 0.1, diversity: 1, genres: ["剧情", "历史"] },
  "李沧东": { name: "李沧东", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "社会"] },
  "努里·比格·锡兰": { name: "努里·比格·锡兰", era: 3, style: 0.4, diversity: 1, genres: ["剧情", "艺术"] },
  "维姆·文德斯": { name: "维姆·文德斯", era: 2, style: 0.3, diversity: 1, genres: ["剧情", "公路"] },
  "艾拉·萨克斯": { name: "艾拉·萨克斯", era: 3, style: 0.1, diversity: 1, genres: ["剧情", "家庭"] },
  "德尼·勒泰利埃": { name: "德尼·勒泰利埃", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "喜剧"] },
  "玛伦·阿德": { name: "玛伦·阿德", era: 3, style: 0.3, diversity: 1, genres: ["剧情", "家庭"] },

  // EXPD 深渊潜水员 - 暗黑/争议导演
  "拉斯·冯·提尔": { name: "拉斯·冯·提尔", era: 2, style: 0.5, diversity: 1, genres: ["剧情", "惊悚"] },
  "朴赞郁": { name: "朴赞郁", era: 3, style: 0.6, diversity: 1, genres: ["惊悚", "复仇"] },
  "加斯帕尔·诺埃": { name: "加斯帕尔·诺埃", era: 3, style: 0.7, diversity: 1, genres: ["惊悚", "情色"] },
  "阿里·艾斯特": { name: "阿里·艾斯特", era: 3, style: 0.4, diversity: 1, genres: ["恐怖", "惊悚"] },
  "米夏埃尔·哈内克": { name: "米夏埃尔·哈内克", era: 2, style: 0.6, diversity: 1, genres: ["惊悚", "剧情"] },
  "园子温": { name: "园子温", era: 3, style: 0.5, diversity: 1, genres: ["恐怖", "惊悚"] },
  "蔡明亮": { name: "蔡明亮", era: 2, style: 0.3, diversity: 1, genres: ["艺术", "实验"] },
  "贝拉·塔尔": { name: "贝拉·塔尔", era: 2, style: 0.5, diversity: 1, genres: ["剧情", "艺术"] },
  "布鲁诺·杜蒙": { name: "布鲁诺·杜蒙", era: 3, style: 0.4, diversity: 1, genres: ["剧情", "喜剧"] },

  // EXWL 星际旅行家 - 科幻/史诗大导
  "史蒂文·斯皮尔伯格": { name: "史蒂文·斯皮尔伯格", era: 2, style: 0.3, diversity: 0, genres: ["科幻", "冒险"] },
  "吉尔莫·德尔·托罗": { name: "吉尔莫·德尔·托罗", era: 3, style: 0.5, diversity: 1, genres: ["科幻", "奇幻"] },
  "丹尼斯·维伦纽瓦": { name: "丹尼斯·维伦纽瓦", era: 3, style: 0.6, diversity: 1, genres: ["科幻", "惊悚"] },
  "詹姆斯·卡梅隆": { name: "詹姆斯·卡梅隆", era: 2, style: 0.7, diversity: 0, genres: ["科幻", "动作"] },
  "雷德利·斯科特": { name: "雷德利·斯科特", era: 2, style: 0.5, diversity: 0, genres: ["科幻", "史诗"] },
  "彼得·杰克逊": { name: "彼得·杰克逊", era: 3, style: 0.5, diversity: 0, genres: ["奇幻", "冒险"] },
  "吕克·贝松": { name: "吕克·贝松", era: 2, style: 0.4, diversity: 1, genres: ["科幻", "动作"] },
  "乔治·米勒": { name: "乔治·米勒", era: 2, style: 0.5, diversity: 1, genres: ["科幻", "动作"] },
  "大卫·芬奇": { name: "大卫·芬奇", era: 2, style: 0.6, diversity: 0, genres: ["科幻", "惊悚"] },
  "约瑟夫·科辛斯基": { name: "约瑟夫·科辛斯基", era: 3, style: 0.7, diversity: 1, genres: ["科幻", "冒险"] },

  // EXWD 末日收藏家 - 末世/暗黑史诗
  "奉俊昊": { name: "奉俊昊", era: 3, style: 0.5, diversity: 1, genres: ["惊悚", "社会"] },
  "阿方索·卡隆": { name: "阿方索·卡隆", era: 3, style: 0.5, diversity: 1, genres: ["科幻", "剧情"] },
  "斯坦利·库布里克": { name: "斯坦利·库布里克", era: 1, style: 0.8, diversity: 0, genres: ["科幻", "惊悚"] },
  "克里斯托弗·诺兰": { name: "克里斯托弗·诺兰", era: 3, style: 0.7, diversity: 0, genres: ["科幻", "惊悚"] },
  "丹尼·鲍尔": { name: "丹尼·鲍尔", era: 3, style: 0.4, diversity: 1, genres: ["科幻", "惊悚"] },
  "亚历杭德罗·冈萨雷斯·伊尼亚里图": { name: "亚历杭德罗·冈萨雷斯·伊尼亚里图", era: 3, style: 0.3, diversity: 1, genres: ["剧情", "惊悚"] },
  "杰夫·尼科尔斯": { name: "杰夫·尼科尔斯", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "科幻"] },
  "亚当·柯蒂斯": { name: "亚当·柯蒂斯", era: 3, style: 0.6, diversity: 1, genres: ["纪录片", "政治"] },

  // ESPL 深夜重映厅 - 日式温暖/治愈
  "宫崎骏": { name: "宫崎骏", era: 2, style: 0.3, diversity: 1, genres: ["动画", "奇幻"] },
  "岩井俊二": { name: "岩井俊二", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "爱情"] },
  "新海诚": { name: "新海诚", era: 3, style: 0.6, diversity: 1, genres: ["动画", "爱情"] },
  "河濑直美": { name: "河濑直美", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "自然"] },
  "北野武": { name: "北野武", era: 2, style: 0.4, diversity: 1, genres: ["剧情", "暴力"] },
  "高畑勋": { name: "高畑勋", era: 2, style: 0.3, diversity: 1, genres: ["动画", "剧情"] },
  "细田守": { name: "细田守", era: 3, style: 0.5, diversity: 1, genres: ["动画", "奇幻"] },
  "今井美树": { name: "今井美树", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "家庭"] },
  "大森寿美男": { name: "大森寿美男", era: 3, style: 0.3, diversity: 1, genres: ["剧情", "家庭"] },

  // ESPD 旧巷夜行人 - 华语黑色/文艺
  "王家卫": { name: "王家卫", era: 2, style: 0.5, diversity: 1, genres: ["剧情", "爱情"] },
  "大卫·林奇": { name: "大卫·林奇", era: 2, style: 0.8, diversity: 0, genres: ["惊悚", "艺术"] },
  "黑泽清": { name: "黑泽清", era: 3, style: 0.6, diversity: 1, genres: ["惊悚", "心理"] },
  "杜琪峰": { name: "杜琪峰", era: 3, style: 0.4, diversity: 1, genres: ["犯罪", "黑帮"] },
  "娄烨": { name: "娄烨", era: 3, style: 0.3, diversity: 1, genres: ["剧情", "爱情"] },
  "贾樟柯": { name: "贾樟柯", era: 3, style: 0.2, diversity: 1, genres: ["剧情", "社会"] },
  "杨德昌": { name: "杨德昌", era: 2, style: 0.3, diversity: 1, genres: ["剧情", "社会"] },
  "徐克": { name: "徐克", era: 2, style: 0.6, diversity: 1, genres: ["动作", "武侠"] },

  // ESWL 老片放映员 - 经典好莱坞
  "弗兰克·德拉邦特": { name: "弗兰克·德拉邦特", era: 2, style: 0.2, diversity: 0, genres: ["剧情", "监狱"] },
  "罗伯特·泽米吉斯": { name: "罗伯特·泽米吉斯", era: 2, style: 0.3, diversity: 0, genres: ["剧情", "励志"] },
  "彼得·威尔": { name: "彼得·威尔", era: 2, style: 0.2, diversity: 1, genres: ["剧情", "理想主义"] },
  "克林特·伊斯特伍德": { name: "克林特·伊斯特伍德", era: 1, style: 0.2, diversity: 0, genres: ["剧情", "西部"] },
  "西德尼·吕美特": { name: "西德尼·吕美特", era: 1, style: 0.3, diversity: 0, genres: ["剧情", "法庭"] },
  "比利·怀尔德": { name: "比利·怀尔德", era: 1, style: 0.4, diversity: 0, genres: ["喜剧", "黑色"] },
  "约翰·福特": { name: "约翰·福特", era: 1, style: 0.3, diversity: 0, genres: ["西部", "史诗"] },
  "斯坦利·克莱默": { name: "斯坦利·克莱默", era: 1, style: 0.2, diversity: 0, genres: ["剧情", "社会"] },

  // ESWD 经典暗黑信徒 - 黑帮/犯罪经典
  "弗朗西斯·科波拉": { name: "弗朗西斯·科波拉", era: 1, style: 0.4, diversity: 0, genres: ["犯罪", "黑帮"] },
  "马丁·斯科塞斯": { name: "马丁·斯科塞斯", era: 1, style: 0.5, diversity: 0, genres: ["犯罪", "黑帮"] },
  "科恩兄弟": { name: "科恩兄弟", era: 2, style: 0.5, diversity: 0, genres: ["犯罪", "黑色"] },
  "黑泽明": { name: "黑泽明", era: 1, style: 0.5, diversity: 1, genres: ["剧情", "武士"] },
  "昆汀·塔伦蒂诺": { name: "昆汀·塔伦蒂诺", era: 2, style: 0.4, diversity: 0, genres: ["犯罪", "暴力"] },
  "布莱恩·德·帕尔玛": { name: "布莱恩·德·帕尔玛", era: 1, style: 0.6, diversity: 0, genres: ["惊悚", "犯罪"] },
  "塞尔乔·莱翁内": { name: "塞尔乔·莱翁内", era: 1, style: 0.4, diversity: 1, genres: ["西部", "黑帮"] },
  "迈克尔·曼": { name: "迈克尔·曼", era: 2, style: 0.5, diversity: 0, genres: ["犯罪", "动作"] },

  // AXPL 独立片鉴赏家 - 美国独立导演
  "理查德·林克莱特": { name: "理查德·林克莱特", era: 2, style: 0.2, diversity: 0, genres: ["剧情", "爱情"] },
  "格蕾塔·葛韦格": { name: "格蕾塔·葛韦格", era: 3, style: 0.2, diversity: 0, genres: ["剧情", "女性"] },
  "滨口龙介": { name: "滨口龙介", era: 3, style: 0.3, diversity: 1, genres: ["剧情", "艺术"] },
  "韦斯·安德森": { name: "韦斯·安德森", era: 3, style: 0.9, diversity: 0, genres: ["喜剧", "风格化"] },
  "诺亚·波拜克": { name: "诺亚·波拜克", era: 3, style: 0.2, diversity: 0, genres: ["剧情", "家庭"] },
  "凯莉·雷查德": { name: "凯莉·雷查德", era: 3, style: 0.3, diversity: 0, genres: ["剧情", "公路"] },
  "迈克·李": { name: "迈克·李", era: 2, style: 0.1, diversity: 1, genres: ["剧情", "社会"] },
  "约翰·卡萨维茨": { name: "约翰·卡萨维茨", era: 1, style: 0.3, diversity: 0, genres: ["剧情", "独立"] },
  "吉姆·贾木许": { name: "吉姆·贾木许", era: 2, style: 0.2, diversity: 1, genres: ["剧情", "公路"] },
  "斯派克·李": { name: "斯派克·李", era: 2, style: 0.4, diversity: 0, genres: ["剧情", "社会"] },

  // AXPD 邪典解剖师 - 风格化/ cult
  "尼古拉斯·温丁·雷弗恩": { name: "尼古拉斯·温丁·雷弗恩", era: 3, style: 0.8, diversity: 1, genres: ["惊悚", "风格化"] },
  "亚历桑德罗·佐杜洛夫斯基": { name: "亚历桑德罗·佐杜洛夫斯基", era: 1, style: 0.9, diversity: 1, genres: ["邪典", "宗教"] },
  "大卫·柯南伯格": { name: "大卫·柯南伯格", era: 2, style: 0.7, diversity: 1, genres: ["恐怖", "科幻"] },
  "今敏": { name: "今敏", era: 3, style: 0.8, diversity: 1, genres: ["动画", "惊悚"] },
  "中岛哲也": { name: "中岛哲也", era: 3, style: 0.6, diversity: 1, genres: ["剧情", "黑色"] },
  "三池崇史": { name: "三池崇史", era: 3, style: 0.6, diversity: 1, genres: ["恐怖", "暴力"] },
  "深作欣二": { name: "深作欣二", era: 2, style: 0.5, diversity: 1, genres: ["动作", "暴力"] },

  // AXWL 工业光魔研究员 - 视效大片
  "乔治·卢卡斯": { name: "乔治·卢卡斯", era: 1, style: 0.8, diversity: 0, genres: ["科幻", "冒险"] },
  "罗兰·艾默里奇": { name: "罗兰·艾默里奇", era: 2, style: 0.5, diversity: 1, genres: ["科幻", "灾难"] },
  "朗·霍华德": { name: "朗·霍华德", era: 2, style: 0.3, diversity: 0, genres: ["剧情", "传记"] },
  "安东尼·罗素": { name: "安东尼·罗素", era: 3, style: 0.5, diversity: 0, genres: ["科幻", "超级英雄"] },
  "乔·罗素": { name: "乔·罗素", era: 3, style: 0.5, diversity: 0, genres: ["科幻", "超级英雄"] },
  "詹姆斯·冈恩": { name: "詹姆斯·冈恩", era: 3, style: 0.4, diversity: 1, genres: ["科幻", "超级英雄"] },
  "塔伊加·维迪提": { name: "塔伊加·维迪提", era: 3, style: 0.6, diversity: 1, genres: ["喜剧", "奇幻"] },

  // AXWD 诺兰逆向工程师 - 烧脑悬疑
  "莱恩·约翰逊": { name: "莱恩·约翰逊", era: 3, style: 0.5, diversity: 0, genres: ["悬疑", "科幻"] },
  "埃德加·赖特": { name: "埃德加·赖特", era: 3, style: 0.7, diversity: 1, genres: ["喜剧", "动作"] },
  "尼尔·博格": { name: "尼尔·博格", era: 3, style: 0.5, diversity: 0, genres: ["惊悚", "科幻"] },
  "Christopher Nolan": { name: "克里斯托弗·诺兰", era: 3, style: 0.7, diversity: 0, genres: ["科幻", "悬疑"] },

  // ASPL 人间烟火品鉴师 - 华语作者导演
  "小津安二郎": { name: "小津安二郎", era: 1, style: 0.1, diversity: 1, genres: ["剧情", "家庭"] },
  "许鞍华": { name: "许鞍华", era: 2, style: 0.1, diversity: 1, genres: ["剧情", "女性"] },
  "李安": { name: "李安", era: 2, style: 0.3, diversity: 1, genres: ["剧情", "跨文化"] },
  "成濑巳喜男": { name: "成濑巳喜男", era: 1, style: 0.1, diversity: 1, genres: ["剧情", "女性"] },
  "沟口健二": { name: "沟口健二", era: 1, style: 0.2, diversity: 1, genres: ["剧情", "女性"] },
  "市川昆": { name: "市川昆", era: 1, style: 0.3, diversity: 1, genres: ["剧情", "文学改编"] },
  "衣笠贞之": { name: "衣笠贞之", era: 1, style: 0.4, diversity: 1, genres: ["艺术", "实验"] },

  // ASPD 悬疑验尸官 - 悬疑/推理
  "阿尔弗雷德·希区柯克": { name: "阿尔弗雷德·希区柯克", era: 1, style: 0.7, diversity: 0, genres: ["悬疑", "惊悚"] },
  "布莱恩·辛格": { name: "布莱恩·辛格", era: 3, style: 0.5, diversity: 0, genres: ["悬疑", "惊悚"] },
  "中韩名": { name: "陈正道", era: 3, style: 0.4, diversity: 1, genres: ["悬疑", "惊悚"] },
  "达米安·沙兹勒": { name: "达米安·沙兹勒", era: 3, style: 0.5, diversity: 0, genres: ["惊悚", "心理"] },

  // ASWL 史诗测评师 - 史诗大片
  "大卫·里恩": { name: "大卫·里恩", era: 1, style: 0.4, diversity: 1, genres: ["史诗", "历史"] },

  // ASWD 影史编年者 - 电影史经典
  "弗里茨·朗": { name: "弗里茨·朗", era: 1, style: 0.6, diversity: 1, genres: ["科幻", "黑色"] },
  "安德烈·塔可夫斯基": { name: "安德烈·塔可夫斯基", era: 1, style: 0.8, diversity: 1, genres: ["艺术", "哲学"] },
  "英格玛·伯格曼": { name: "英格玛·伯格曼", era: 1, style: 0.5, diversity: 1, genres: ["艺术", "哲学"] },
  "让-吕克·戈达尔": { name: "让-吕克·戈达尔", era: 1, style: 0.7, diversity: 1, genres: ["艺术", "政治"] },
  "奥逊·威尔斯": { name: "奥逊·威尔斯", era: 1, style: 0.8, diversity: 1, genres: ["剧情", "黑色"] },
  "费德里科·费里尼": { name: "费德里科·费里尼", era: 1, style: 0.7, diversity: 1, genres: ["艺术", "超现实"] },
  "米开朗基罗·安东尼奥尼": { name: "米开朗基罗·安东尼奥尼", era: 1, style: 0.6, diversity: 1, genres: ["艺术", "现代主义"] },
  "罗伯托·罗西里尼": { name: "罗伯托·罗西里尼", era: 1, style: 0.4, diversity: 1, genres: ["新现实主义", "宗教"] },
  "路易斯·布努埃尔": { name: "路易斯·布努埃尔", era: 1, style: 0.7, diversity: 1, genres: ["超现实", "讽刺"] },
  "雅克·塔蒂": { name: "雅克·塔蒂", era: 1, style: 0.4, diversity: 1, genres: ["喜剧", "视觉"] },
};

// Metadata for all films across all personality types
export const filmsMeta: Record<string, FilmMeta> = {
  // EXPL
  "小偷家族": { title: "小偷家族", year: 2018, director: "是枝裕和", style: 0.1, genres: [] },
  "樱桃的滋味": { title: "樱桃的滋味", year: 1997, director: "阿巴斯·基亚罗斯塔米", style: 0.2, genres: [] },
  "海街日记": { title: "海街日记", year: 2015, director: "是枝裕和", style: 0.1, genres: [] },
  "燃烧": { title: "燃烧", year: 2018, director: "李沧东", style: 0.3, genres: [] },
  "天堂电影院": { title: "天堂电影院", year: 1988, director: "托纳多雷", style: 0.1, genres: [] },
  "菊次郎的夏天": { title: "菊次郎的夏天", year: 1999, director: "北野武", style: 0.2, genres: [] },
  "地球最后的夜晚": { title: "地球最后的夜晚", year: 2018, director: "毕赣", style: 0.5, genres: [] },
  // EXPD
  "仲夏夜惊魂": { title: "仲夏夜惊魂", year: 2019, director: "阿里·艾斯特", style: 0.5, genres: [] },
  "老男孩": { title: "老男孩", year: 2003, director: "朴赞郁", style: 0.6, genres: [] },
  "不可撤销": { title: "不可撤销", year: 2002, director: "加斯帕尔·诺埃", style: 0.7, genres: [] },
  "趣味游戏": { title: "趣味游戏", year: 1997, director: "米夏埃尔·哈内克", style: 0.6, genres: [] },
  "梦之安魂曲": { title: "梦之安魂曲", year: 2000, director: "阿伦诺夫斯基", style: 0.6, genres: [] },
  "悲情城市": { title: "悲情城市", year: 1989, director: "侯孝贤", style: 0.1, genres: [] },
  "索多玛120天": { title: "索多玛120天", year: 1975, director: "帕索里尼", style: 0.8, genres: [] },
  // EXWL
  "银翼杀手2049": { title: "银翼杀手2049", year: 2017, director: "丹尼斯·维伦纽瓦", style: 0.7, genres: [] },
  "潘神的迷宫": { title: "潘神的迷宫", year: 2006, director: "吉尔莫·德尔·托罗", style: 0.5, genres: [] },
  "沙丘": { title: "沙丘", year: 2021, director: "丹尼斯·维伦纽瓦", style: 0.6, genres: [] },
  "星际穿越": { title: "星际穿越", year: 2014, director: "克里斯托弗·诺兰", style: 0.6, genres: [] },
  "阿凡达": { title: "阿凡达", year: 2009, director: "詹姆斯·卡梅隆", style: 0.8, genres: [] },
  "指环王1：护戒使者": { title: "指环王1：护戒使者", year: 2001, director: "彼得·杰克逊", style: 0.5, genres: [] },
  "头号玩家": { title: "头号玩家", year: 2018, director: "史蒂文·斯皮尔伯格", style: 0.5, genres: [] },
  // EXWD
  "寄生虫": { title: "寄生虫", year: 2019, director: "奉俊昊", style: 0.5, genres: [] },
  "银翼杀手": { title: "银翼杀手", year: 1982, director: "雷德利·斯科特", style: 0.6, genres: [] },
  "人类之子": { title: "人类之子", year: 2006, director: "阿方索·卡隆", style: 0.6, genres: [] },
  "发条橙": { title: "发条橙", year: 1971, director: "斯坦利·库布里克", style: 0.8, genres: [] },
  "蝙蝠侠：黑暗骑士": { title: "蝙蝠侠：黑暗骑士", year: 2008, director: "克里斯托弗·诺兰", style: 0.5, genres: [] },
  "127小时": { title: "127小时", year: 2010, director: "丹尼·鲍尔", style: 0.4, genres: [] },
  "荒野猎人": { title: "荒野猎人", year: 2015, director: "亚历杭德罗·冈萨雷斯·伊尼亚里图", style: 0.3, genres: [] },
  // ESPL
  "龙猫": { title: "龙猫", year: 1988, director: "宫崎骏", style: 0.2, genres: [] },
  "小森林：夏秋篇": { title: "小森林：夏秋篇", year: 2014, director: "森淳一", style: 0.1, genres: [] },
  "情书": { title: "情书", year: 1995, director: "岩井俊二", style: 0.2, genres: [] },
  "你的名字": { title: "你的名字", year: 2016, director: "新海诚", style: 0.7, genres: [] },
  "步履不停": { title: "步履不停", year: 2008, director: "是枝裕和", style: 0.1, genres: [] },
  // ESPD
  "花样年华": { title: "花样年华", year: 2000, director: "王家卫", style: 0.6, genres: [] },
  "穆赫兰道": { title: "穆赫兰道", year: 2001, director: "大卫·林奇", style: 0.9, genres: [] },
  "堕落天使": { title: "堕落天使", year: 1995, director: "王家卫", style: 0.5, genres: [] },
  "重庆森林": { title: "重庆森林", year: 1994, director: "王家卫", style: 0.5, genres: [] },
  "蓝丝绒": { title: "蓝丝绒", year: 1986, director: "大卫·林奇", style: 0.8, genres: [] },
  "回路": { title: "回路", year: 2001, director: "黑泽清", style: 0.6, genres: [] },
  "春风沉醉的夜晚": { title: "春风沉醉的夜晚", year: 2009, director: "娄烨", style: 0.3, genres: [] },
  // ESWL
  "肖申克的救赎": { title: "肖申克的救赎", year: 1994, director: "弗兰克·德拉邦特", style: 0.2, genres: [] },
  "阿甘正传": { title: "阿甘正传", year: 1994, director: "罗伯特·泽米吉斯", style: 0.3, genres: [] },
  "死亡诗社": { title: "死亡诗社", year: 1989, director: "彼得·威尔", style: 0.2, genres: [] },
  "拯救大兵瑞恩": { title: "拯救大兵瑞恩", year: 1998, director: "史蒂文·斯皮尔伯格", style: 0.4, genres: [] },
  "绿皮书": { title: "绿皮书", year: 2018, director: "彼得·法雷利", style: 0.2, genres: [] },
  "十二怒汉": { title: "十二怒汉", year: 1957, director: "西德尼·吕美特", style: 0.3, genres: [] },
  "当幸福来敲门": { title: "当幸福来敲门", year: 2006, director: "加布里埃尔·穆奇诺", style: 0.2, genres: [] },
  // ESWD
  "教父": { title: "教父", year: 1972, director: "弗朗西斯·科波拉", style: 0.4, genres: [] },
  "好家伙": { title: "好家伙", year: 1990, director: "马丁·斯科塞斯", style: 0.5, genres: [] },
  "老无所依": { title: "老无所依", year: 2007, director: "科恩兄弟", style: 0.5, genres: [] },
  "出租车司机": { title: "出租车司机", year: 1976, director: "马丁·斯科塞斯", style: 0.5, genres: [] },
  "罗生门": { title: "罗生门", year: 1950, director: "黑泽明", style: 0.5, genres: [] },
  "低俗小说": { title: "低俗小说", year: 1994, director: "昆汀·塔伦蒂诺", style: 0.4, genres: [] },
  "美国往事": { title: "美国往事", year: 1984, director: "赛尔乔·莱翁内", style: 0.3, genres: [] },
  // AXPL
  "爱在黎明破晓前": { title: "爱在黎明破晓前", year: 1995, director: "理查德·林克莱特", style: 0.1, genres: [] },
  "伯德小姐": { title: "伯德小姐", year: 2017, director: "格蕾塔·葛韦格", style: 0.2, genres: [] },
  "驾驶我的车": { title: "驾驶我的车", year: 2021, director: "滨口龙介", style: 0.3, genres: [] },
  "月升王国": { title: "月升王国", year: 2012, director: "韦斯·安德森", style: 0.9, genres: [] },
  "婚姻故事": { title: "婚姻故事", year: 2019, director: "诺亚·波拜克", style: 0.2, genres: [] },
  "帕特森": { title: "帕特森", year: 2016, director: "吉姆·贾木许", style: 0.2, genres: [] },
  "佛罗里达乐园": { title: "佛罗里达乐园", year: 2017, director: "肖恩·贝克", style: 0.2, genres: [] },
  // AXPD
  "亡命驾驶": { title: "亡命驾驶", year: 2011, director: "尼古拉斯·温丁·雷弗恩", style: 0.8, genres: [] },
  "圣山": { title: "圣山", year: 1973, director: "亚历桑德罗·佐杜洛夫斯基", style: 0.9, genres: [] },
  "切肤之爱": { title: "切肤之爱", year: 1999, director: "三池崇史", style: 0.5, genres: [] },
  "欲望号快车": { title: "欲望号快车", year: 1996, director: "大卫·柯南伯格", style: 0.7, genres: [] },
  "红辣椒": { title: "红辣椒", year: 2006, director: "今敏", style: 0.8, genres: [] },
  "被嫌弃的松子的一生": { title: "被嫌弃的松子的一生", year: 2006, director: "中岛哲也", style: 0.7, genres: [] },
  // AXWL
  "指环王3：王者无敌": { title: "指环王3：王者无敌", year: 2003, director: "彼得·杰克逊", style: 0.6, genres: [] },
  "星球大战4：新希望": { title: "星球大战4：新希望", year: 1977, director: "乔治·卢卡斯", style: 0.7, genres: [] },
  "盗梦空间": { title: "盗梦空间", year: 2010, director: "克里斯托弗·诺兰", style: 0.7, genres: [] },
  "独立日": { title: "独立日", year: 1996, director: "罗兰·艾默里奇", style: 0.5, genres: [] },
  // AXWD
  "信条": { title: "信条", year: 2020, director: "克里斯托弗·诺兰", style: 0.8, genres: [] },
  "搏击俱乐部": { title: "搏击俱乐部", year: 1999, director: "大卫·芬奇", style: 0.7, genres: [] },
  "降临": { title: "降临", year: 2016, director: "丹尼斯·维伦纽瓦", style: 0.6, genres: [] },
  "记忆碎片": { title: "记忆碎片", year: 2000, director: "克里斯托弗·诺兰", style: 0.6, genres: [] },
  "七宗罪": { title: "七宗罪", year: 1995, director: "大卫·芬奇", style: 0.6, genres: [] },
  // ASPL
  "东京物语": { title: "东京物语", year: 1953, director: "小津安二郎", style: 0.1, genres: [] },
  "桃姐": { title: "桃姐", year: 2011, director: "许鞍华", style: 0.1, genres: [] },
  "饮食男女": { title: "饮食男女", year: 1994, director: "李安", style: 0.3, genres: [] },
  "童年往事": { title: "童年往事", year: 1985, director: "侯孝贤", style: 0.1, genres: [] },
  "山河故人": { title: "山河故人", year: 2015, director: "贾樟柯", style: 0.2, genres: [] },
  "一一": { title: "一一", year: 2000, director: "杨德昌", style: 0.3, genres: [] },
  "浮草": { title: "浮草", year: 1959, director: "小津安二郎", style: 0.1, genres: [] },
  // ASPD
  "迷魂记": { title: "迷魂记", year: 1958, director: "阿尔弗雷德·希区柯克", style: 0.7, genres: [] },
  "消失的爱人": { title: "消失的爱人", year: 2014, director: "大卫·芬奇", style: 0.6, genres: [] },
  "杀人回忆": { title: "杀人回忆", year: 2003, director: "奉俊昊", style: 0.5, genres: [] },
  "非常嫌疑犯": { title: "非常嫌疑犯", year: 1995, director: "布莱恩·辛格", style: 0.5, genres: [] },
  // ASWL
  "2001太空漫游": { title: "2001太空漫游", year: 1968, director: "斯坦利·库布里克", style: 0.8, genres: [] },
  "阿拉伯的劳伦斯": { title: "阿拉伯的劳伦斯", year: 1962, director: "大卫·里恩", style: 0.4, genres: [] },
  "角斗士": { title: "角斗士", year: 2000, director: "雷德利·斯科特", style: 0.4, genres: [] },
  "泰坦尼克号": { title: "泰坦尼克号", year: 1997, director: "詹姆斯·卡梅隆", style: 0.5, genres: [] },
  // ASWD
  "大都会": { title: "大都会", year: 1927, director: "弗里茨·朗", style: 0.7, genres: [] },
  "潜行者": { title: "潜行者", year: 1979, director: "安德烈·塔可夫斯基", style: 0.9, genres: [] },
  "第七封印": { title: "第七封印", year: 1957, director: "英格玛·伯格曼", style: 0.5, genres: [] },
  "精疲力尽": { title: "精疲力尽", year: 1960, director: "让-吕克·戈达尔", style: 0.7, genres: [] },
  "公民凯恩": { title: "公民凯恩", year: 1941, director: "奥逊·威尔斯", style: 0.8, genres: [] },
  "八部半": { title: "八部半", year: 1963, director: "费德里科·费里尼", style: 0.7, genres: [] },
};

/**
 * Score a director based on user's hidden attributes.
 * - High α → older directors (lower era)
 * - High β → formalist/technical directors (higher style)
 * - High γ → international/indie directors (higher diversity)
 * - δ doesn't apply to directors (no genre tags yet)
 */
export function scoreDirector(
  director: DirectorMeta,
  alphaNorm: number,
  betaNorm: number,
  gammaNorm: number
): number {
  // Era affinity: α=0 → prefers contemporary(3), α=1 → prefers classic(1)
  const eraScore = 1 - (alphaNorm * ((director.era - 1) / 2) + (1 - alphaNorm) * ((3 - director.era) / 2));

  // Style affinity: β=0 → prefers naturalist(0), β=1 → prefers formalist(1)
  const styleScore = 1 - Math.abs(director.style - betaNorm);

  // Diversity affinity: γ=0 → prefers mainstream, γ=1 → prefers international
  const diversityScore = 1 - Math.abs(director.diversity - gammaNorm);

  // Weights: era 30%, style 40%, diversity 30%
  return eraScore * 0.3 + styleScore * 0.4 + diversityScore * 0.3;
}

/**
 * Score a film based on user's hidden attributes.
 * Same logic as director scoring, but uses film metadata directly.
 */
export function scoreFilm(
  film: FilmMeta,
  alphaNorm: number,
  betaNorm: number,
  gammaNorm: number,
  directorScore: number
): number {
  const yearNorm = Math.max(0, Math.min(1, (film.year - 1920) / (2024 - 1920)));
  const eraScore = 1 - (alphaNorm * yearNorm + (1 - alphaNorm) * (1 - yearNorm));
  const styleScore = 1 - Math.abs(film.style - betaNorm);

  // Blend film's own score with its director's score (60% film, 40% director)
  return eraScore * 0.25 + styleScore * 0.35 + directorScore * 0.4;
}
