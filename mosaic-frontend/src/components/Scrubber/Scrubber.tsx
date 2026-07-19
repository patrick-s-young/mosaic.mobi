import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { UploadState, RootState } from '@typescript/types';
import { ScrubberState } from '@interfaces/ScrubberState';
import { ScrubberProps } from '@interfaces/ScrubberProps';
import { AppState } from '@interfaces/AppState';
import { getAspectHeight } from '@/app.config';
import '@components/Scrubber/scrubber.css';

// carousel timing: hold each background frame, then dissolve into the next.
// One frame therefore occupies HOLD_MS + CROSSFADE_MS on screen.
const HOLD_MS = 500;
const CROSSFADE_MS = 500;

const Scrubber: React.FC<ScrubberProps> = (): React.JSX.Element => {
  const bottomImgRef = useRef<HTMLImageElement | null>(null);
  const topImgRef = useRef<HTMLImageElement | null>(null);
  const { imageURLs, imageURLs9x16 } = useSelector<RootState, UploadState>((state) => state.upload);
  const { canvasWidth, aspectRatio } = useSelector<RootState, AppState>((state) => state.app);
  const { currentScrubberFrame, videoUploadCount, carouselMode } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const activeImageURLs = aspectRatio === '9x16' ? imageURLs9x16 : imageURLs;
  const canvasHeight = getAspectHeight(canvasWidth, aspectRatio);
  // the base (bottom) layer keeps the original 1:1/9:16 classes so its layout is
  // unchanged; the overlay (top) layer sits directly over it and is crossfaded.
  const baseClassName = aspectRatio === '9x16' ? 'scrubber-img--9x16' : '';
  const overlayClassName = `${baseClassName} scrubber-img--overlay`.trim();

  // static (slider) mode: show the manually selected frame on the bottom layer
  // and keep the crossfade overlay hidden.
  useEffect(() => {
    if (carouselMode) return;
    const bottom = bottomImgRef.current;
    const top = topImgRef.current;
    if (!bottom || !top || activeImageURLs.length === 0) return;
    bottom.src = activeImageURLs[currentScrubberFrame];
    top.style.transition = 'none';
    top.style.opacity = '0';
  }, [carouselMode, currentScrubberFrame, videoUploadCount, aspectRatio, activeImageURLs]);

  // carousel mode: loop through every frame. The bottom layer always shows the
  // current frame at full opacity; the overlay fades the next frame in over it,
  // then the bottom is swapped to that same (already fully visible) frame so the
  // reset for the following step is seamless (no flash).
  useEffect(() => {
    if (!carouselMode) return;
    const bottom = bottomImgRef.current;
    const top = topImgRef.current;
    const frameCount = activeImageURLs.length;
    if (!bottom || !top || frameCount === 0) return;

    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let index = currentScrubberFrame % frameCount;

    bottom.src = activeImageURLs[index];
    top.style.transition = 'none';
    top.style.opacity = '0';
    top.src = activeImageURLs[(index + 1) % frameCount];

    const runStep = () => {
      if (cancelled) return;
      timers.push(setTimeout(() => {
        if (cancelled) return;
        top.style.transition = `opacity ${CROSSFADE_MS}ms linear`;
        void top.offsetWidth; // commit the starting opacity before transitioning
        top.style.opacity = '1';
        timers.push(setTimeout(() => {
          if (cancelled) return;
          index = (index + 1) % frameCount;
          bottom.src = activeImageURLs[index]; // matches the now fully visible overlay
          top.style.transition = 'none';
          top.style.opacity = '0';
          void top.offsetWidth;
          top.src = activeImageURLs[(index + 1) % frameCount];
          runStep();
        }, CROSSFADE_MS));
      }, HOLD_MS));
    };
    runStep();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // currentScrubberFrame is only read as the starting index; it is frozen
    // while the slider is disabled, so it is intentionally not a restart trigger.
  }, [carouselMode, videoUploadCount, aspectRatio, activeImageURLs]);

  return (
    <div className='scrubber-container'>
      { activeImageURLs.length > 0 &&
        <>
          <img
            ref={bottomImgRef}
            className={baseClassName}
            width={canvasWidth}
            height={canvasHeight}
          />
          <img
            ref={topImgRef}
            className={overlayClassName}
            width={canvasWidth}
            height={canvasHeight}
          />
        </>
      }
    </div>
  );
}

export default Scrubber;
