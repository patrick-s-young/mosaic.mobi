import * as React from 'react';
// Redux
import { useSelector } from 'react-redux';
import type { RootState } from '@store/rootReducer';
import type { UploadState } from '@/components/UploadVideo/uploadSlice.interface';
import type { AppState } from '@components/App/appSlice';
import ScrubberFrames from '@components/Scrubber/ScrubberFrames';
import '@components/Scrubber/scrubber.css';


const Scrubber: React.FC = () => {
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
