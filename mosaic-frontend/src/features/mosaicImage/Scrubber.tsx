import * as React from 'react';
import ScrubberFrames from 'features/mosaicImage/ScrubberFrames';
import 'features/mosaicImage/scrubberStyles.css';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { RootState } from 'app/rootReducer';
import { useSelector } from 'react-redux';

const Scrubber: React.FC = () => {
  const { imageURLs, canvasWidth } = useSelector<RootState, UploadState>((state) => state.upload);

  return (
    <div className='scrubber-container'>
      <ScrubberFrames
        width={canvasWidth}
        height={canvasWidth}
        imageArr={imageURLs}
      />
    </div>
  );
}

export default Scrubber;
