import { useEffect, useMemo, useRef } from 'react';
import { Slider } from '@material-ui/core';
import { MAX_VIDEO_UPLOAD_DURATION } from '@/app.config';
import './trimVideo.scss';

interface TrimVideoProps {
  file: File
  duration: number
  start: number
  onChange: (start: number) => void
  isActive: boolean
  maxHeight: number
}

const formatTime = (seconds: number): string => {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

// Picks the 15 seconds of a longer video to use. The window has a fixed length
// and the slider moves it; the preview plays only that window, on a loop.
const TrimVideo: React.FC<TrimVideoProps> = ({ file, duration, start, onChange, isActive, maxHeight }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  const latestStart = Math.max(0, duration - MAX_VIDEO_UPLOAD_DURATION);
  const end = Math.min(duration, start + MAX_VIDEO_UPLOAD_DURATION);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  const restartWindow = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = start;
    if (isActive) video.play().catch(() => {});
  };

  useEffect(restartWindow, [start]);

  useEffect(() => {
    if (isActive) restartWindow();
    else videoRef.current?.pause();
  }, [isActive]);

  // timeupdate fires a few times a second, so the window can overrun by a moment
  const keepInWindow = () => {
    const video = videoRef.current;
    if (video && (video.currentTime >= end || video.currentTime < start - 0.3)) restartWindow();
  };

  return (
    <div className='trimVideo'>
      <video
        ref={videoRef}
        className='trimVideo__preview'
        src={url}
        style={{ maxHeight }}
        aria-label='Preview of the selected 15 seconds'
        muted
        playsInline
        onLoadedMetadata={restartWindow}
        onTimeUpdate={keepInWindow}
        onEnded={restartWindow}
      />
      <Slider
        className='trimVideo__slider'
        value={start}
        min={0}
        max={latestStart}
        step={0.1}
        onChange={(_, value) => onChange(value as number)}
        aria-label='Start of the selected 15 seconds'
        getAriaValueText={formatTime}
      />
      <div className='trimVideo__times' aria-hidden='true'>
        <span>{formatTime(start)}</span>
        <span>{formatTime(end)}</span>
      </div>
    </div>
  );
};

export default TrimVideo;
