import FileDownload from 'js-file-download';
import { isMobileDevice } from '@/app.config';

export type SaveResult = 'shared' | 'downloaded' | 'cancelled';

const VIDEO_TYPE = 'video/mp4';

const exportFileName = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `mosaic_${date}_${time}.mp4`;
};

// The share sheet is what offers Save Video and apps like Instagram on a phone.
// Desktop browsers can have one too, but there a normal download is what people
// expect.
export const canShareVideo = (): boolean => {
  if (!isMobileDevice || !navigator.canShare) return false;
  return navigator.canShare({ files: [new File([], 'video.mp4', { type: VIDEO_TYPE })] });
};

// Must run directly from a tap: browsers only open the share sheet in response
// to one. Anything except the user closing the sheet falls back to a download,
// so they always have a way to get their video.
export const saveVideo = async (video: Blob): Promise<SaveResult> => {
  const filename = exportFileName();
  if (canShareVideo()) {
    try {
      await navigator.share({ files: [new File([video], filename, { type: VIDEO_TYPE })] });
      return 'shared';
    } catch (err: any) {
      if (err?.name === 'AbortError') return 'cancelled';
    }
  }
  FileDownload(video, filename, VIDEO_TYPE);
  return 'downloaded';
};
