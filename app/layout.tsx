import type { Metadata } from "next";
import {
  Playfair_Display,
  Inter,
  Noto_Serif_SC,
  Noto_Sans_SC,
} from "next/font/google";
import "./globals.css";
import PosterWall from "@/components/PosterWall";
import PosterOpacityController from "@/components/PosterOpacityController";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerifSc = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "FBTI - Film Buff Type Indicator · 影迷类型指标",
  description: "每个人都是一座电影院。回答 20 个问题，发现你的电影人格类型。",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${playfair.variable} ${inter.variable} ${notoSerifSc.variable} ${notoSansSc.variable} h-full`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1695694480478235"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-[#0a0e1a] text-white antialiased">
        <PosterOpacityController />
        <PosterWall />
        <div className="relative z-10">
          {children}
        </div>
        <footer className="relative z-10 w-full py-4 flex justify-center">
          <a
            href="https://stats.uptimerobot.com/8SFsjhzzd8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            服务状态
          </a>
        </footer>
      </body>
    </html>
  );
}
