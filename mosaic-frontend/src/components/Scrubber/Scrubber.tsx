import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { UploadState, RootState } from '@typescript/types';
import { ScrubberState } from '@interfaces/ScrubberState';
import { ScrubberProps } from '@interfaces/ScrubberProps';
import { AppState } from '@interfaces/AppState';
import '@components/Scrubber/scrubber.css';

const Scrubber: React.FC<ScrubberProps> = (): React.JSX.Element => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { imageURLs } = useSelector<RootState, UploadState>((state) => state.upload);
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);
	const { currentScrubberFrame, videoUploadCount } = useSelector<RootState, ScrubberState>((state) => state.scrubber);

  useEffect(() => {
		if (imgRef.current !== null) {
			imgRef.current.src = imageURLs[currentScrubberFrame];
		}
	}, [currentScrubberFrame, videoUploadCount]);

  return (
    <div className='scrubber-container'>
      { imageURLs.length > 0 &&
        <img
          ref={imgRef}
          width={canvasWidth}
          height={canvasWidth}
        />
      }
    </div>
  );
}

export default Scrubber;
