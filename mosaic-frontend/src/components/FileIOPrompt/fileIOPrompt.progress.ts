import type { UploadProgress } from '@typescript/types';

export type FrameProgress = { actionName: string | null, currentFrame: number, totalFrames: number };

// where each part of an upload sits on the one bar the user sees. Sending gets
// the most room because on a slow connection it is by far the longest wait.
const SENDING_END = 60;
const PROCESSING_END = 92;

// each server step's share of the processing part of the bar
const PROCESSING_STEPS: { [key: string]: [number, number] } = {
  Cropping: [0, 0.5],
  Resizing: [0.5, 0.75],
  Exporting: [0.75, 1]
};

const frameFraction = ({ currentFrame, totalFrames }: FrameProgress): number =>
  totalFrames > 0 ? Math.min(1, currentFrame / totalFrames) : 0;

const lerp = (start: number, end: number, fraction: number): number =>
  start + (end - start) * fraction;

export const getUploadProgress = (upload: UploadProgress, frames: FrameProgress) => {
  if (upload.stage === 'sending') {
    return { label: 'Uploading your video', percent: lerp(0, SENDING_END, upload.fraction) };
  }
  if (upload.stage === 'loading') {
    return { label: 'Loading your preview', percent: lerp(PROCESSING_END, 100, upload.fraction) };
  }
  const step = PROCESSING_STEPS[frames.actionName ?? ''] ?? [0, 0];
  const fraction = lerp(step[0], step[1], frameFraction(frames));
  return { label: 'Preparing your video', percent: lerp(SENDING_END, PROCESSING_END, fraction) };
};

// the finished video still has to reach the phone, which is a real wait on a slow
// connection, so it keeps the last part of the bar
const RENDER_END = 90;

export const getRenderProgress = (frames: FrameProgress, downloadFraction: number) => {
  if (downloadFraction > 0) {
    return { label: 'Finishing your video', percent: lerp(RENDER_END, 100, downloadFraction) };
  }
  return {
    label: 'Creating your video',
    percent: frames.actionName === 'Rendering' ? lerp(0, RENDER_END, frameFraction(frames)) : 0
  };
};
