import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { UploadState, RootState } from '@typescript/types';
import { ScrubberState } from '@interfaces/ScrubberState';
import { ScrubberProps } from '@interfaces/ScrubberProps';
import { AppState } from '@interfaces/AppState';
import { getAspectHeight } from '@/app.config';
import '@components/Scrubber/scrubber.css';

const Scrubber: React.FC<ScrubberProps> = (): React.JSX.Element => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { imageURLs, imageURLs9x16 } = useSelector<RootState, UploadState>((state) => state.upload);
  const { canvasWidth, aspectRatio } = useSelector<RootState, AppState>((state) => state.app);
	const { currentScrubberFrame, videoUploadCount } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const activeImageURLs = aspectRatio === '9x16' ? imageURLs9x16 : imageURLs;
  const canvasHeight = getAspectHeight(canvasWidth, aspectRatio);

  useEffect(() => {
		if (imgRef.current !== null) {
			imgRef.current.src = activeImageURLs[currentScrubberFrame];
		}
	}, [currentScrubberFrame, videoUploadCount, aspectRatio]);

  return (
    <div className='scrubber-container'>
      { activeImageURLs.length > 0 &&
        <img
          ref={imgRef}
          className={aspectRatio === '9x16' ? 'scrubber-img--9x16' : ''}
          width={canvasWidth}
          height={canvasHeight}
        />
      }
    </div>
  );
}

export default Scrubber;
