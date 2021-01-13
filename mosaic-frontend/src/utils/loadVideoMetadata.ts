// exported out of videoSlice
export interface VideoMetadata {
  src: string
  duration: number
  width: number
  height: number
}

export interface LoadVideoMetadata {
 (src: string, waitLimit: number): Promise<VideoMetadata>
}

export const loadVideoMetadata: LoadVideoMetadata = (
  src,
  waitLimit) => {
  let timeoutId: NodeJS.Timeout;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(`Request timed out at ${waitLimit} second`);
    }, waitLimit);
  });

  let videoMetadata = new Promise<VideoMetadata>((resolve, _reject) => {
    const newVideo = document.createElement('video');
    newVideo.src = src;
    newVideo.addEventListener('loadedmetadata', (ev: Event) => {
      const target = ev.currentTarget as HTMLVideoElement;
      resolve({ 
        src,
        duration: target.duration,
        width: target.videoWidth,
        height: target.videoHeight
      });
      clearTimeout(timeoutId);
    }, { once: true })
  });


  return Promise.race([
    videoMetadata,
    timeout
  ]);
}
