import { describe, it, expect } from 'vitest';
import { extractVideosFromURL } from '../functions/extractVideos';
import { OpenPageOptions } from '../functions/openPage';

describe(
  'extractVideosFromURL',
  () => {
    it('should extract videos from a given URL', async () => {
      const options: OpenPageOptions = {
        url: 'https://uk.pinterest.com/search/pins/?q=anime%20videos&rs=typed', //'https://app.klingai.com/global/community/video',
        isLocal: true,
        headless: true,
        waitUntil: 'networkidle0',
      };
      const videos = await extractVideosFromURL(options);

      console.log('VIDEOS', videos);

      expect(Array.isArray(videos)).toBe(true);
      expect(videos.length).toBeGreaterThan(0);

      videos.forEach(video => {
        expect(video).toHaveProperty('src');
        expect(video).toHaveProperty('sources');
        expect(video).toHaveProperty('poster');
        expect(video).toHaveProperty('videoPermalink');
        expect(video).toHaveProperty('pagePermalink');
        expect(video).toHaveProperty('width');
        expect(video).toHaveProperty('height');

        if (video.src) {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
          expect(urlRegex.test(video.src)).toBe(true);
        } else {
          expect(video.sources).not.toBeNull();
        }

        if (video.sources) {
          expect(video.sources).toBeInstanceOf(Array);
          video.sources.forEach(source => {
            expect(source).toHaveProperty('src');
            expect(typeof source.src).toBe('string');
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            expect(urlRegex.test(source.src)).toBe(true);
            expect(source).toHaveProperty('type');
            if (source.type) {
              expect(typeof source.type).toBe('string');
            }
          });
        }
      });
    });
  },
  { timeout: 60000 },
);
