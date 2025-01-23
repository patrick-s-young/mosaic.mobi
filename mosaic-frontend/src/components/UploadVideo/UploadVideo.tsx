import { traceEvent } from '@analytics/traceEvent';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store/rootReducer';
import { setAppPhase, AppPhaseEnum } from '@/components/App/appSlice';
import type { AppState } from '@/components/App/appSlice';
import { setUploadPhase } from '@components/UploadVideo/uploadSlice';
import { UploadPhaseEnum } from '@components/UploadVideo/uploadSlice.interface';
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages 
} from '@api/index';
import type { UploadState } from '@/components/UploadVideo/uploadSlice.interface';
import { setMosaicFormatting, setMosaicPhase, MosaicPhaseEnum } from '@components/MosaicTiles/mosaicSlice';
import { setNavPhase, NavPhaseEnum } from '@components/Navigation/navSlice';
import PopOver from '@components/PopOver/PopOver';
import SlideInOut from '@components/SideInOut/SlideInOut';
import { setVideoUploadCount } from '@components/Scrubber/scrubberSlice';
import type { AppDispatch } from '@store/store';
import FileIOPrompt from '@/components/FileIOPrompt/FileIOPrompt';
import './uploadVideo.scss';

export interface UploadVideoProps {
  displaySize: { width: number, height: number }
  isActive: boolean
}

const UploadVideo: React.FC<UploadVideoProps> = ({ displaySize, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);
  const { uploadPhase, 
          assetID, 
          selectedFile,
          uploadDuration,
          resizedWidth } = useSelector<RootState, UploadState>((state) => state.upload); 

  const inputRef = useRef<HTMLInputElement>(null);   
  const slideInOutProps = {
    enter: `${0.2 * displaySize.height}px`,
    exit: `${displaySize.height}px`
  }
  const popOverProps = {
    width: `${displaySize.width}px`,
    height: `${displaySize.height}px`,
    showTop: `0px`,
    hideTop: `${displaySize.height}px`,
    isActive: isActive
  }

  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:    
        if (selectedFile !== undefined) {
          dispatch(uploadUserVideo(selectedFile));
          dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
        }
        break;
      case UploadPhaseEnum.VIDEO_UPLOADED:
        traceEvent({
          category: 'Upload',
          action: 'VIDEO_UPLOADED:',
          label: 'N/A'
        });
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.CANCEL_ANIMATION }));
        dispatch(preloadUserVideo(`/uploads/${assetID}/resized.mov`));
        break;
      case UploadPhaseEnum.VIDEO_PRELOADED:
        dispatch(preloadSequentialImages(assetID));
        break;
      case UploadPhaseEnum.IMAGES_PRELOADED:
        dispatch(setMosaicFormatting({ duration: uploadDuration, videoWidth: resizedWidth, canvasWidth}));
        dispatch(setVideoUploadCount({increment: 1}));
        dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.MOSAIC_INITIALIZED}));
        break;
      case UploadPhaseEnum.MOSAIC_INITIALIZED:
        dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.PROMPT}));
        dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));   
        dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING}));  
        break;
    }
  }, [uploadPhase]);

  function onFormSubmit (event: { target: HTMLInputElement }) {
    dispatch(preUploadValidation(event));
  }

  const onCancel = () => {
    dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.PROMPT}));
    dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));   
  }

  const handleUploadButtonClick = () => {
    inputRef.current?.click();
  }

  return (
    <PopOver
      {...popOverProps}
    >
      <input
        ref={inputRef}
        accept="video/*"
        className='uploadVideo__input'
        type="file"
        onChange={onFormSubmit}
      />
      <div className='uploadVideo' style={{ width: displaySize.width, height: displaySize.height }}>
        <div className='uploadVideo__centerScreen'>

          <SlideInOut 
            isActive={uploadPhase === UploadPhaseEnum.PROMPT}
            {...slideInOutProps}
          >
            <FileIOPrompt action='upload' callBack={handleUploadButtonClick} onCancel={onCancel} />
          </SlideInOut>
          

          <SlideInOut 
            isActive={uploadPhase === UploadPhaseEnum.VIDEO_SUBMITED || uploadPhase === UploadPhaseEnum.VIDEO_UPLOADING || uploadPhase === UploadPhaseEnum.VIDEO_UPLOADED ||  uploadPhase === UploadPhaseEnum.VIDEO_PRELOADED || uploadPhase === UploadPhaseEnum.IMAGES_PRELOADED || uploadPhase === UploadPhaseEnum.MOSAIC_INITIALIZED }
            {...slideInOutProps}
          >
            <FileIOPrompt action='uploading' />
          </SlideInOut>


          <SlideInOut 
            isActive={uploadPhase === UploadPhaseEnum.VIDEO_TOO_LONG}
            {...slideInOutProps}
          >
            <FileIOPrompt action='videoTooLong' callBack={handleUploadButtonClick} onCancel={onCancel} videoDuration={uploadDuration} />
          </SlideInOut>
        </div>

      </div>
    </PopOver>
  );
}

export default UploadVideo;