#!/bin/bash
cd /root/fbti-app/public

# 备份原始视频
cp poster-wall.mp4 poster-wall-original.mp4

# 优化版 MP4：
# - 分辨率降到 960px 宽（高度等比缩放）
# - CRF 35（大幅降低质量，反正只有25%可见度看不出差异）
# - preset slow（更好的压缩效率）
# - 帧率降到 24fps
ffmpeg -i poster-wall-original.mp4 \
  -vf "scale=960:-2" \
  -c:v libx264 -crf 35 -preset slow \
  -r 24 -pix_fmt yuv420p \
  -movflags +faststart \
  -y poster-wall.mp4

# 生成 WebM 版本（更小，现代浏览器优先加载）
ffmpeg -i poster-wall-original.mp4 \
  -vf "scale=960:-2" \
  -c:v libvpx-vp9 -crf 45 -b:v 0 \
  -r 24 \
  -y poster-wall.webm

# 生成静态首帧作为 poster（视频加载前显示）
ffmpeg -i poster-wall.mp4 \
  -vframes 1 -q:v 10 \
  -y poster-wall-poster.jpg

# 输出文件大小对比
echo "=== 文件大小对比 ==="
ls -lh poster-wall-original.mp4 poster-wall.mp4 poster-wall.webm poster-wall-poster.jpg
