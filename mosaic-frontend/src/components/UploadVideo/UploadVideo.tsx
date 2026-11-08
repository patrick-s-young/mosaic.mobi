import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// api
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages,
  loadRemainingFrames,
  reportFailure
} from '@api/index';
// slices
import { confirmTrim, setUploadPhase } from '@/components/UploadVideo/upload.slice';
import { setAppPhase, setHint, setKeepSound } from '@/app.slice';
import { setMosaicFormatting, setMosaicPhase } from '@components/MosaicTiles/mosaicTiles.slice';
import { setNavPhase } from '@components/Navigation/nav.slice';
import { setVideoUploadCount } from '@components/Scrubber/scrubber.slice';
// components
import PopOver from '@components/PopOver/PopOver';
import SlideInOut from '@components/SideInOut/SlideInOut';
import FileIOPrompt from '@components/FileIOPrompt/FileIOPrompt';
import TrimVideo from '@components/UploadVideo/TrimVideo';
import { failureMessage } from '@components/FileIOPrompt/fileIOPrompt.config';
import { MAX_VIDEO_UPLOAD_DURATION, popOverProps, slideInOutProps } from '@/app.config';
// interfaces
import { UploadVideoProps } from '@interfaces/UploadVideoProps';
import { AppState } from '@interfaces/AppState';
// types
import { AppDispatch, RootState, UploadState } from '@typescript/types';
// enums
import { AppPhaseEnum, NavPhaseEnum, MosaicPhaseEnum, UploadPhaseEnum } from '@typescript/enums';
import './uploadVideo.scss';



// room left for the headline, message, slider and buttons around the trim preview
const TRIM_CHROME_HEIGHT = 340;

const UploadVideo: React.FC<UploadVideoProps> = ({ displaySize, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { canvasWidth, aspectRatio } = useSelector<RootState, AppState>((state) => state.app);
  const { uploadPhase, 
          assetID, 
          selectedFile,
          uploadDuration,
          resizedWidth,
          failure,
          uploadProgress,
          originalDuration,
          trimStart } = useSelector<RootState, UploadState>((state) => state.upload); 
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRequestRef = useRef<{ abort: () => void }>();
  const [trimDraft, setTrimDraft] = useState(0);
  const needsTrim = selectedFile !== undefined && originalDuration > MAX_VIDEO_UPLOAD_DURATION;

  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:
        if (selectedFile !== undefined) {
          logEvent(AnalyticsEvent.UPLOAD_VIDEO, {
            file_size_mb: Math.round((selectedFile.size / (1024 * 1024)) * 10) / 10,
            file_type: selectedFile.type || 'unknown',
            duration_s: Math.round(originalDuration * 10) / 10,
            trimmed: needsTrim
          });
          uploadRequestRef.current = dispatch(uploadUserVideo({ file: selectedFile, trimStart }));
          dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
        }
        break;
      case UploadPhaseEnum.TRIMMING:
        setTrimDraft(0);
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
        // the first load happens behind the editor, so bring the message forward
        dispatch(setNavPhase({ navPhase: NavPhaseEnum.UPLOAD }));
        break;
      case UploadPhaseEnum.VIDEO_UPLOADED:
        // the demo's first load has no preview to stop, and has to stay in the
        // waiting state so the controls can't act on a video that isn't there yet
        if (selectedFile !== undefined) {
          dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.CANCEL_ANIMATION }));
          dispatch(setKeepSound({ keepSound: false }));
        }
        dispatch(preloadUserVideo({ assetID, aspectRatio }));
        break;
      case UploadPhaseEnum.VIDEO_PRELOADED:
        dispatch(preloadSequentialImages({ assetID, aspectRatio }));
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
          dispatch(setHint({ hint: 'nextStep' }));
        }
        dispatch(loadRemainingFrames({ assetID, aspectRatio }));
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

  // only offered while the file is still sending; after that the server is
  // already working on it
  const onCancelUpload = () => {
    uploadRequestRef.current?.abort();
    logEvent(AnalyticsEvent.CANCEL, { stage: 'uploading' });
    reportFailure({ stage: 'upload', reason: 'cancelled', detail: `${Math.round(uploadProgress.fraction * 100)}% sent` });
    dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING }));
  }

  const onUseClip = () => {
    logEvent(AnalyticsEvent.TRIM_VIDEO, {
      original_duration_s: Math.round(originalDuration * 10) / 10,
      trim_start_s: Math.round(trimDraft * 10) / 10
    });
    dispatch(confirmTrim({ trimStart: trimDraft }));
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

  const isUploading = uploadPhase === UploadPhaseEnum.VIDEO_SUBMITED || uploadPhase === UploadPhaseEnum.VIDEO_UPLOADING || uploadPhase === UploadPhaseEnum.VIDEO_UPLOADED ||  uploadPhase === UploadPhaseEnum.VIDEO_PRELOADED || uploadPhase === UploadPhaseEnum.IMAGES_PRELOADED || uploadPhase === UploadPhaseEnum.MOSAIC_INITIALIZED;

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
            isActive={isUploading}
            {...slideInOutProps}
          >
            <FileIOPrompt action='uploading' isActive={isUploading} uploadProgress={uploadProgress} onCancel={onCancelUpload} />
          </SlideInOut>


          <SlideInOut
            isActive={uploadPhase === UploadPhaseEnum.TRIMMING}
            {...slideInOutProps}
            enter='12px'
          >
            <FileIOPrompt
              action='trim'
              callBack={onUseClip}
              onCancel={onCancel}
              messageOverride={`Choose ${MAX_VIDEO_UPLOAD_DURATION} seconds from your ${Math.round(originalDuration)}-second video.`}
            >
              {needsTrim &&
                <TrimVideo
                  file={selectedFile}
                  duration={originalDuration}
                  start={trimDraft}
                  onChange={setTrimDraft}
                  isActive={uploadPhase === UploadPhaseEnum.TRIMMING}
                  maxHeight={displaySize.height - TRIM_CHROME_HEIGHT}
                />
              }
            </FileIOPrompt>
          </SlideInOut>

          <SlideInOut
            isActive={uploadPhase === UploadPhaseEnum.UPLOAD_FAILED}
            {...slideInOutProps}
          >
            {/* no cancel for a failed preview download: there is no video to go back to */}
            <FileIOPrompt
              action='uploadFailed'
              headlineOverride={isPreloadFailure ? 'LOADING FAILED' : undefined}
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