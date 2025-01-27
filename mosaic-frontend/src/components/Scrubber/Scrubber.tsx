import * as React from 'react';
import { useSelector } from 'react-redux';
import type { UploadState, RootState } from '@typescript/types';
import ScrubberFrames from '@components/Scrubber/ScrubberFrames';
import { ScrubberProps } from '@interfaces/ScrubberProps';
import { AppState } from '@interfaces/AppState';
import '@components/Scrubber/scrubber.css';


const Scrubber: React.FC<ScrubberProps> = () => {
  const { imageURLs } = useSelector<RootState, UploadState>((state) => state.upload);
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);

  return (
    <div className='scrubber-container'>
      { imageURLs.length > 0 &&
        <ScrubberFrames
          width={canvasWidth}
          height={canvasWidth}
          imageArr={imageURLs}
        />
      }
    </div>
  );
}

export default Scrubber;
