import * as React from 'react';
// Redux
import { useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { AppState } from 'app/appSlice';
// <Scrubber>
import 'features/mosaicImage/scrubber.css';
// <ScrubberFrames>
import ScrubberFrames from 'features/mosaicImage/ScrubberFrames';

const Scrubber: React.FC = () => {
  const { imageURLs } = useSelector<RootState, UploadState>((state) => state.upload);
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);

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
