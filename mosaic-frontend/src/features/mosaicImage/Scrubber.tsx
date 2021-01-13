import * as React from 'react';
import ScrubberFrames from 'features/mosaicImage/ScrubberFrames';
import 'features/mosaicImage/scrubberStyles.css';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { RootState } from 'app/rootReducer';
import { useSelector } from 'react-redux';

const Scrubber: React.FC = () => {

  const { imageURLs } = useSelector<RootState, UploadState>((state) => state.upload);
  
  // move to upload.slice
  const width: number = window.innerWidth; //375; //480;
  const height: number = window.innerWidth; //480;

  return (
    <div className='scrubber-container'>
      <ScrubberFrames
        width={width}
        height={height}
        imageArr={imageURLs}
      />
    </div>
  );
}

export default Scrubber;
