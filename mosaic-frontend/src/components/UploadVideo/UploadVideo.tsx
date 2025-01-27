import { traceEvent } from '@analytics/traceEvent';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// api
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages 
} from '@api/index';
// slices
import { setUploadPhase } from '@/components/UploadVideo/upload.slice';
import { setAppPhase } from '@components/App/app.slice';
import { setMosaicFormatting, setMosaicPhase } from '@components/MosaicTiles/mosaicTiles.slice';
import { setNavPhase } from '@components/Navigation/nav.slice';
import { setVideoUploadCount } from '@components/Scrubber/scrubber.slice';
// components
import PopOver from '@components/PopOver/PopOver';
import SlideInOut from '@components/SideInOut/SlideInOut';
import FileIOPrompt from '@components/FileIOPrompt/FileIOPrompt';
import { popOverProps, slideInOutProps } from '@components/App/app.config';
// interfaces
import { UploadVideoProps } from '@interfaces/UploadVideoProps';
import { AppState } from '@interfaces/AppState';
// types
import { AppDispatch, RootState, UploadState } from '@typescript/types';
// enums
import { AppPhaseEnum, NavPhaseEnum, MosaicPhaseEnum, UploadPhaseEnum } from '@typescript/enums';
import './uploadVideo.scss';



const UploadVideo: React.FC<UploadVideoProps> = ({ displaySize, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);
  const { uploadPhase, 
          assetID, 
          selectedFile,
          uploadDuration,
          resizedWidth } = useSelector<RootState, UploadState>((state) => state.upload); 
  const inputRef = useRef<HTMLInputElement>(null);   


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
    <PopOver {...popOverProps} isActive={isActive}>
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