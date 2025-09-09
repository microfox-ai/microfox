import fs from 'fs';
import ytdl from '@distube/ytdl-core';

// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

fs.mkdirSync('out/youtube', { recursive: true });
const videoUrl = 'https://www.youtube.com/watch?v=yao9ww00ul4';
ytdl(videoUrl).pipe(fs.createWriteStream('out/youtube/video.mp4'));

// Get video info
ytdl.getBasicInfo(videoUrl).then(info => {
  console.log(info.videoDetails.title);
});

// Get video info with download formats
ytdl.getInfo(videoUrl).then(info => {
  console.log(info.formats);
});

// ffmpeg -i out/youtube/video.mp4 -filter:v "select='gt(scene,0.4)',showinfo" -f null- 2> ffout
// SCENE CHANGE DETECTION - WORKING with full FFmpeg
// Extract frames where scene changes are detected (threshold 0.3)
// ffmpeg -i out/youtube/video.mp4 -vf "select='gt(scene,0.3)'" -vsync vfr scene_%03d.png

// Alternative scene change detection with different thresholds:
// Lower threshold (more sensitive) - more frames extracted
// ffmpeg -i out/youtube/video.mp4 -vf "select='gt(scene,0.1)'" -vsync vfr scene_low_%03d.png

// Higher threshold (less sensitive) - fewer frames extracted
// ffmpeg -i out/youtube/video.mp4 -vf "select='gt(scene,0.5)'" -vsync vfr scene_high_%03d.png

// TIME-BASED EXTRACTION (using Remotion FFmpeg - limited filters)
// Extract frame at 0 seconds (first frame)
// npx remotion ffmpeg -i out/youtube/video.mp4 -vf "trim=start=0:duration=1" -frames:v 1 -update 1 img001.png

// Extract frame at 2 seconds
// npx remotion ffmpeg -i out/youtube/video.mp4 -vf "trim=start=2:duration=1" -frames:v 1 -update 1 img002.png

// Extract frame at 4 seconds
// npx remotion ffmpeg -i out/youtube/video.mp4 -vf "trim=start=4:duration=1" -frames:v 1 -update 1 img003.png
