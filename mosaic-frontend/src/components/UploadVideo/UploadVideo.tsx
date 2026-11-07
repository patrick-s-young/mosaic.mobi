import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// api
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages,
  reportFailure
} from '@api/index';
// slices
import { setUploadPhase } from '@/components/UploadVideo/upload.slice';
import { setAppPhase } from '@/app.slice';
import { setMosaicFormatting, setMosaicPhase } from '@components/MosaicTiles/mosaicTiles.slice';
import { setNavPhase } from '@components/Navigation/nav.slice';
import { setVideoUploadCount } from '@components/Scrubber/scrubber.slice';
// components
import PopOver from '@components/PopOver/PopOver';
import SlideInOut from '@components/SideInOut/SlideInOut';
import FileIOPrompt from '@components/FileIOPrompt/FileIOPrompt';
import { failureMessage } from '@components/FileIOPrompt/fileIOPrompt.config';
import { popOverProps, slideInOutProps } from '@/app.config';
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
  const { canvasWidth, aspectRatio } = useSelector<RootState, AppState>((state) => state.app);
  const { uploadPhase, 
          assetID, 
          selectedFile,
          uploadDuration,
          resizedWidth,
          failure } = useSelector<RootState, UploadState>((state) => state.upload); 
  const inputRef = useRef<HTMLInputElement>(null);   

  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:
        if (selectedFile !== undefined) {
          logEvent(AnalyticsEvent.UPLOAD_VIDEO, {
            file_size_mb: Math.round((selectedFile.size / (1024 * 1024)) * 10) / 10,
            file_type: selectedFile.type || 'unknown',
            duration_s: Math.round(uploadDuration * 10) / 10
          });
          dispatch(uploadUserVideo(selectedFile));
          dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
        }
        break;
      case UploadPhaseEnum.VIDEO_TOO_LONG:
        logEvent(AnalyticsEvent.UPLOAD_REJECTED, {
          reason: 'too_long',
          duration_s: Math.round(uploadDuration * 10) / 10
        });
        reportFailure({ stage: 'validation', reason: 'too_long', detail: `${uploadDuration}s` });
        break;
      case UploadPhaseEnum.UPLOAD_FAILED:
        if (failure !== undefined) {
          logEvent(AnalyticsEvent.UPLOAD_ERROR, {
            stage: failure.stage,
            reason: failure.reason,
            status: failure.status ?? 0
          });
          reportFailure(failure, failure.stage === 'preload' ? assetID : undefined);
        }
        dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING }));
        break;
      case UploadPhaseEnum.VIDEO_UPLOADED:
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.CANCEL_ANIMATION }));
        dispatch(preloadUserVideo(assetID));
        break;
      case UploadPhaseEnum.VIDEO_PRELOADED:
        dispatch(preloadSequentialImages(assetID));
        break;
      case UploadPhaseEnum.IMAGES_PRELOADED:
        dispatch(setMosaicFormatting({ duration: uploadDuration, videoWidth: resizedWidth, canvasWidth, aspectRatio }));
        dispatch(setVideoUploadCount({increment: 1}));
        dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.MOSAIC_INITIALIZED}));
        break;
      case UploadPhaseEnum.MOSAIC_INITIALIZED:
        // the demo video passes through this phase on every page load
        if (selectedFile !== undefined) {
          logEvent(AnalyticsEvent.UPLOAD_SUCCESS, {
            duration_s: Math.round(uploadDuration * 10) / 10,
            aspect_ratio: aspectRatio
          });
        }
        dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.PROMPT}));
        dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));
        dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING}));
        break;
    }
  }, [uploadPhase]);

  function onFormSubmit (event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // cleared so choosing the same file again (after a failure) still fires onChange
    event.target.value = '';
    if (file) dispatch(preUploadValidation(file));
  }

  const onCancel = () => {
    dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.PROMPT}));
    dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));   
  }

  const handleUploadButtonClick = () => {
    inputRef.current?.click();
  }

  // the upload itself worked if only the download failed, so fetch it again
  // rather than asking the user to pick and send the file a second time
  const isPreloadFailure = failure?.stage === 'preload';
  const onRetry = () => {
    if (isPreloadFailure) {
      dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING }));
      dispatch(setUploadPhase({ uploadPhase: UploadPhaseEnum.VIDEO_UPLOADED }));
    } else {
      handleUploadButtonClick();
    }
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

          <SlideInOut
            isActive={uploadPhase === UploadPhaseEnum.UPLOAD_FAILED}
            {...slideInOutProps}
          >
            {/* no cancel for a failed preview download: there is no video to go back to */}
            <FileIOPrompt
              action='uploadFailed'
              callBack={onRetry}
              onCancel={onCancel}
              messageOverride={failureMessage(failure)}
              showCancel={!isPreloadFailure}
            />
          </SlideInOut>
        </div>

      </div>
    </PopOver>
  );
}

export default UploadVideo;