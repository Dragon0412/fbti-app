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
  // EXPL 宝藏猎人
  "是枝裕和": { name: "是枝裕和", era: 3, style: 0, diversity: 1, genres: [] },
  "阿巴斯·基亚罗斯塔米": { name: "阿巴斯·基亚罗斯塔米", era: 2, style: 0.3, diversity: 1, genres: [] },
  "阿基·考里斯马基": { name: "阿基·考里斯马基", era: 2, style: 0.2, diversity: 1, genres: [] },
  "侯孝贤": { name: "侯孝贤", era: 2, style: 0.1, diversity: 1, genres: [] },
  "李沧东": { name: "李沧东", era: 3, style: 0.2, diversity: 1, genres: [] },
  "努里·比格·锡兰": { name: "努里·比格·锡兰", era: 3, style: 0.4, diversity: 1, genres: [] },
  "维姆·文德斯": { name: "维姆·文德斯", era: 2, style: 0.3, diversity: 1, genres: [] },
  // EXPD 深渊潜水员
  "拉斯·冯·提尔": { name: "拉斯·冯·提尔", era: 2, style: 0.5, diversity: 1, genres: [] },
  "朴赞郁": { name: "朴赞郁", era: 3, style: 0.6, diversity: 1, genres: [] },
  "加斯帕尔·诺埃": { name: "加斯帕尔·诺埃", era: 3, style: 0.7, diversity: 1, genres: [] },
  "阿里·艾斯特": { name: "阿里·艾斯特", era: 3, style: 0.4, diversity: 1, genres: [] },
  "米夏埃尔·哈内克": { name: "米夏埃尔·哈内克", era: 2, style: 0.6, diversity: 1, genres: [] },
  "园子温": { name: "园子温", era: 3, style: 0.5, diversity: 1, genres: [] },
  "蔡明亮": { name: "蔡明亮", era: 2, style: 0.3, diversity: 1, genres: [] },
  // EXWL 星际旅行家
  "史蒂文·斯皮尔伯格": { name: "史蒂文·斯皮尔伯格", era: 2, style: 0.3, diversity: 0, genres: [] },
  "吉尔莫·德尔·托罗": { name: "吉尔莫·德尔·托罗", era: 3, style: 0.5, diversity: 1, genres: [] },
  "丹尼斯·维伦纽瓦": { name: "丹尼斯·维伦纽瓦", era: 3, style: 0.6, diversity: 1, genres: [] },
  "詹姆斯·卡梅隆": { name: "詹姆斯·卡梅隆", era: 2, style: 0.7, diversity: 0, genres: [] },
  "雷德利·斯科特": { name: "雷德利·斯科特", era: 2, style: 0.5, diversity: 0, genres: [] },
  "彼得·杰克逊": { name: "彼得·杰克逊", era: 3, style: 0.5, diversity: 0, genres: [] },
  "吕克·贝松": { name: "吕克·贝松", era: 2, style: 0.4, diversity: 1, genres: [] },
  // EXWD 末日收藏家
  "奉俊昊": { name: "奉俊昊", era: 3, style: 0.5, diversity: 1, genres: [] },
  "阿方索·卡隆": { name: "阿方索·卡隆", era: 3, style: 0.5, diversity: 1, genres: [] },
  "斯坦利·库布里克": { name: "斯坦利·库布里克", era: 1, style: 0.8, diversity: 0, genres: [] },
  "克里斯托弗·诺兰": { name: "克里斯托弗·诺兰", era: 3, style: 0.7, diversity: 0, genres: [] },
  "丹尼·鲍尔": { name: "丹尼·鲍尔", era: 3, style: 0.4, diversity: 1, genres: [] },
  "亚历杭德罗·冈萨雷斯·伊尼亚里图": { name: "亚历杭德罗·冈萨雷斯·伊尼亚里图", era: 3, style: 0.3, diversity: 1, genres: [] },
  // ESPL 深夜重映厅
  "宫崎骏": { name: "宫崎骏", era: 2, style: 0.3, diversity: 1, genres: [] },
  "岩井俊二": { name: "岩井俊二", era: 3, style: 0.2, diversity: 1, genres: [] },
  "新海诚": { name: "新海诚", era: 3, style: 0.6, diversity: 1, genres: [] },
  "河濑直美": { name: "河濑直美", era: 3, style: 0.2, diversity: 1, genres: [] },
  "北野武": { name: "北野武", era: 2, style: 0.4, diversity: 1, genres: [] },
  "高畑勋": { name: "高畑勋", era: 2, style: 0.3, diversity: 1, genres: [] },
  // ESPD 旧巷夜行人
  "王家卫": { name: "王家卫", era: 2, style: 0.5, diversity: 1, genres: [] },
  "大卫·林奇": { name: "大卫·林奇", era: 2, style: 0.8, diversity: 0, genres: [] },
  "黑泽清": { name: "黑泽清", era: 3, style: 0.6, diversity: 1, genres: [] },
  "杜琪峰": { name: "杜琪峰", era: 3, style: 0.4, diversity: 1, genres: [] },
  "娄烨": { name: "娄烨", era: 3, style: 0.3, diversity: 1, genres: [] },
  // ESWL 老片放映员
  "弗兰克·德拉邦特": { name: "弗兰克·德拉邦特", era: 2, style: 0.2, diversity: 0, genres: [] },
  "罗伯特·泽米吉斯": { name: "罗伯特·泽米吉斯", era: 2, style: 0.3, diversity: 0, genres: [] },
  "彼得·威尔": { name: "彼得·威尔", era: 2, style: 0.2, diversity: 1, genres: [] },
  "克林特·伊斯特伍德": { name: "克林特·伊斯特伍德", era: 1, style: 0.2, diversity: 0, genres: [] },
  "西德尼·吕美特": { name: "西德尼·吕美特", era: 1, style: 0.3, diversity: 0, genres: [] },
  // ESWD 经典暗黑信徒
  "弗朗西斯·科波拉": { name: "弗朗西斯·科波拉", era: 1, style: 0.4, diversity: 0, genres: [] },
  "马丁·斯科塞斯": { name: "马丁·斯科塞斯", era: 1, style: 0.5, diversity: 0, genres: [] },
  "科恩兄弟": { name: "科恩兄弟", era: 2, style: 0.5, diversity: 0, genres: [] },
  "黑泽明": { name: "黑泽明", era: 1, style: 0.5, diversity: 1, genres: [] },
  "昆汀·塔伦蒂诺": { name: "昆汀·塔伦蒂诺", era: 2, style: 0.4, diversity: 0, genres: [] },
  "布莱恩·德·帕尔玛": { name: "布莱恩·德·帕尔玛", era: 1, style: 0.6, diversity: 0, genres: [] },
  // AXPL 独立片鉴赏家
  "理查德·林克莱特": { name: "理查德·林克莱特", era: 2, style: 0.2, diversity: 0, genres: [] },
  "格蕾塔·葛韦格": { name: "格蕾塔·葛韦格", era: 3, style: 0.2, diversity: 0, genres: [] },
  "滨口龙介": { name: "滨口龙介", era: 3, style: 0.3, diversity: 1, genres: [] },
  "韦斯·安德森": { name: "韦斯·安德森", era: 3, style: 0.9, diversity: 0, genres: [] },
  "诺亚·波拜克": { name: "诺亚·波拜克", era: 3, style: 0.2, diversity: 0, genres: [] },
  "凯莉·雷查德": { name: "凯莉·雷查德", era: 3, style: 0.3, diversity: 0, genres: [] },
  // AXPD 邪典解剖师
  "尼古拉斯·温丁·雷弗恩": { name: "尼古拉斯·温丁·雷弗恩", era: 3, style: 0.8, diversity: 1, genres: [] },
  "亚历桑德罗·佐杜洛夫斯基": { name: "亚历桑德罗·佐杜洛夫斯基", era: 1, style: 0.9, diversity: 1, genres: [] },
  "大卫·柯南伯格": { name: "大卫·柯南伯格", era: 2, style: 0.7, diversity: 1, genres: [] },
  "今敏": { name: "今敏", era: 3, style: 0.8, diversity: 1, genres: [] },
  "中岛哲也": { name: "中岛哲也", era: 3, style: 0.6, diversity: 1, genres: [] },
  // AXWL 工业光魔研究员
  "乔治·卢卡斯": { name: "乔治·卢卡斯", era: 1, style: 0.8, diversity: 0, genres: [] },
  "罗兰·艾默里奇": { name: "罗兰·艾默里奇", era: 2, style: 0.5, diversity: 1, genres: [] },
  // AXWD 诺兰逆向工程师
  "刁亦男": { name: "刁亦男", era: 3, style: 0.5, diversity: 1, genres: [] },
  // ASPL 人间烟火品鉴师
  "小津安二郎": { name: "小津安二郎", era: 1, style: 0.1, diversity: 1, genres: [] },
  "许鞍华": { name: "许鞍华", era: 2, style: 0.1, diversity: 1, genres: [] },
  "李安": { name: "李安", era: 2, style: 0.3, diversity: 1, genres: [] },
  "贾樟柯": { name: "贾樟柯", era: 3, style: 0.2, diversity: 1, genres: [] },
  "杨德昌": { name: "杨德昌", era: 2, style: 0.3, diversity: 1, genres: [] },
  "成濑巳喜男": { name: "成濑巳喜男", era: 1, style: 0.1, diversity: 1, genres: [] },
  // ASPD 悬疑验尸官
  "阿尔弗雷德·希区柯克": { name: "阿尔弗雷德·希区柯克", era: 1, style: 0.7, diversity: 0, genres: [] },
  "布莱恩·辛格": { name: "布莱恩·辛格", era: 3, style: 0.5, diversity: 0, genres: [] },
  // ASWL 史诗测评师
  "大卫·里恩": { name: "大卫·里恩", era: 1, style: 0.4, diversity: 1, genres: [] },
  // ASWD 影史编年者
  "弗里茨·朗": { name: "弗里茨·朗", era: 1, style: 0.6, diversity: 1, genres: [] },
  "安德烈·塔可夫斯基": { name: "安德烈·塔可夫斯基", era: 1, style: 0.8, diversity: 1, genres: [] },
  "英格玛·伯格曼": { name: "英格玛·伯格曼", era: 1, style: 0.5, diversity: 1, genres: [] },
  "让-吕克·戈达尔": { name: "让-吕克·戈达尔", era: 1, style: 0.7, diversity: 1, genres: [] },
  "奥逊·威尔斯": { name: "奥逊·威尔斯", era: 1, style: 0.8, diversity: 1, genres: [] },
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
