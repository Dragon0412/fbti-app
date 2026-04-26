"use client";

import { useEffect, useRef, useState } from 'react';

export default function PosterWall() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          video.play().catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-[1] flex items-center justify-center overflow-hidden"
    >
      {/* 视频海报墙 - 垂直居中 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/poster-wall-poster.jpg"
        className="w-full min-h-[80vh] sm:min-h-0 object-cover"
        style={{
          opacity: 0.25,
          filter: 'brightness(0.5)',
        }}
      >
        <source src="/poster-wall.webm" type="video/webm" />
        <source src="/poster-wall.mp4" type="video/mp4" />
      </video>
      
      {/* 中间竖条遮罩 - 遮挡核心内容区域的视频 */}
      <div 
        className="absolute inset-0 z-[2] flex justify-center pointer-events-none"
      >
        <div 
          style={{ 
            width: '100%',
            maxWidth: '60rem',
            background: 'linear-gradient(to right, transparent 0%, rgba(10,14,26,0.95) 8%, #0a0e1a 15%, #0a0e1a 85%, rgba(10,14,26,0.95) 92%, transparent 100%)',
          }}
        />
      </div>

      {/* 顶部渐变遮罩 - 与背景色融合 */}
      <div 
        className="absolute top-0 left-0 right-0"
        style={{ 
          height: '120px',
          background: 'linear-gradient(to bottom, #0a0e1a 0%, transparent 100%)'
        }}
      />
      
      {/* 底部渐变遮罩 */}
      <div 
        className="absolute bottom-0 left-0 right-0"
        style={{ 
          height: '120px',
          background: 'linear-gradient(to top, #0a0e1a 0%, transparent 100%)'
        }}
      />
    </div>
  );
}
