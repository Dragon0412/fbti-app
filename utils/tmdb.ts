const TMDB_API_KEY = "05b5d0763ad31ee3e57d8afc18b25a48";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TmdbMovie {
  id: number;
  title: string;
  title_zh?: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
}

export interface TmdbImage {
  file_path: string;
}

const movieTitleMap: Record<string, string> = {
  "星际穿越": "Interstellar",
  "坠落的审判": "Anatomy of a Fall",
  "一次别离": "A Separation",
  "霸王别姬": "Farewell My Concubine",
  "活着": "To Live",
  "大话西游之大圣娶亲": "A Chinese Odyssey Part Two",
  "让子弹飞": "Let the Bullets Fly",
  "真爱至上": "Love Actually",
  "小鬼当家": "Home Alone",
  "天书奇谭": "The Legends of Sealed Book",
  "月球": "Moon",
  "沙丘": "Dune",
  "小丑": "Joker",
  "无间道": "Infernal Affairs",
  "心灵奇旅": "Soul",
  "蜘蛛侠：平行宇宙": "Spider-Man: Into the Spider-Verse",
  "春光乍泄": "Happy Together",
  "月光男孩": "Moonlight",
  "米尔克": "Milk",
  "逃出绝命镇": "Get Out",
  "别告诉她": "The Farewell",
  "黑豹": "Black Panther",
  "阿甘正传": "Forrest Gump",
  "出租车司机": "Taxi Driver",
  "小偷家族": "Shoplifters",
  "寄生虫": "Parasite",
  "龙猫": "My Neighbor Totoro",
  "佛罗里达乐园": "The Florida Project",
  "火星救援": "The Martian",
  "银翼杀手": "Blade Runner",
  "星球大战": "Star Wars",
  "色，戒": "Lust, Caution",
  "发条橙": "A Clockwork Orange",
  "颐和园": "Summer Palace",
  "索多玛120天": "Salò, or the 120 Days of Sodom",
};

export async function searchMovie(query: string, year?: number): Promise<TmdbMovie | null> {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query,
      language: "zh-CN",
    });
    if (year) {
      params.append("year", year.toString());
    }

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching movie ${query}:`, error);
    return null;
  }
}

export function getPosterUrl(path: string | null, size: string = "w500"): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: string = "w1280"): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function fetchMoviePosters(movies: { title: string; year: number }[]): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};

  for (const movie of movies) {
    const enTitle = movieTitleMap[movie.title] || movie.title;
    const tmdbMovie = await searchMovie(enTitle, movie.year);
    if (tmdbMovie) {
      results[movie.title] = getPosterUrl(tmdbMovie.poster_path);
    } else {
      // Try without year
      const fallback = await searchMovie(enTitle);
      results[movie.title] = fallback ? getPosterUrl(fallback.poster_path) : null;
    }
  }

  return results;
}

// Pre-fetch all poster URLs for the movies in questions
export async function initMoviePosters() {
  const movies = [
    { title: "星际穿越", year: 2014 },
    { title: "坠落的审判", year: 2023 },
    { title: "一次别离", year: 2011 },
    { title: "霸王别姬", year: 1993 },
    { title: "活着", year: 1994 },
    { title: "大话西游之大圣娶亲", year: 1995 },
    { title: "让子弹飞", year: 2010 },
    { title: "真爱至上", year: 2003 },
    { title: "小鬼当家", year: 1990 },
    { title: "天书奇谭", year: 1983 },
    { title: "月球", year: 2009 },
    { title: "沙丘", year: 2021 },
    { title: "小丑", year: 2019 },
    { title: "无间道", year: 2002 },
    { title: "心灵奇旅", year: 2020 },
    { title: "蜘蛛侠：平行宇宙", year: 2018 },
    { title: "春光乍泄", year: 1997 },
    { title: "月光男孩", year: 2016 },
    { title: "米尔克", year: 2008 },
    { title: "逃出绝命镇", year: 2017 },
    { title: "别告诉她", year: 2019 },
    { title: "黑豹", year: 2018 },
    { title: "阿甘正传", year: 1994 },
    { title: "出租车司机", year: 1976 },
    { title: "小偷家族", year: 2018 },
    { title: "寄生虫", year: 2019 },
    { title: "龙猫", year: 1988 },
    { title: "佛罗里达乐园", year: 2017 },
    { title: "火星救援", year: 2015 },
    { title: "银翼杀手", year: 1982 },
    { title: "星球大战", year: 1977 },
    { title: "色，戒", year: 2007 },
    { title: "发条橙", year: 1971 },
    { title: "颐和园", year: 2006 },
    { title: "索多玛120天", year: 1975 },
  ];

  return fetchMoviePosters(movies);
}