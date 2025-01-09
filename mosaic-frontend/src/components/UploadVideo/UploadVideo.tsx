import { traceEvent } from '@analytics/traceEvent';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Redux Toolkit
import type { RootState } from '@store/rootReducer';
// <App>
import { setAppPhase, AppPhaseEnum } from '@/components/App/appSlice';
import type { AppState } from '@/components/App/appSlice';
// <UploadVideo>
import { 
  UploadPhaseEnum,
  setUploadPhase } from '@components/UploadVideo/uploadSlice';
// api
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages 
} from '@api/index';
import type { UploadState } from '@components/UploadVideo/uploadSlice';
// <MosaicTiles>
import { setMosaicFormatting, setMosaicPhase, MosaicPhaseEnum } from '@/components/MosaicTiles/mosaicSlice';
// <Navigation>
import { setNavPhase, NavPhaseEnum } from '@/components/Navigation/navSlice';
// Components
import PopOver from '@components/PopOver/PopOver';
import SlideInOut from '@/components/SideInOut/SlideInOut';
// Material-UI
import { Button, Paper } from '@material-ui/core';
import { useStyles } from '@components/UploadVideo/uploadVideo.useStyles';
import { Warning, LibraryAdd, CloudUpload } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
// scrubberSlice
import { setVideoUploadCount } from '@components/Scrubber/scrubberSlice';
import type { AppDispatch } from '@store/store';


export interface UploadVideoProps {
  displaySize: { width: number, height: number }
  isActive: boolean
}



const UploadVideo: React.FC<UploadVideoProps> = ({ displaySize, isActive }) => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);
  const { uploadPhase, 
          assetID, 
          selectedFile,
          uploadDuration,
          resizedWidth } = useSelector<RootState, UploadState>((state) => state.upload); 

  
  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:    
        traceEvent({
          category: 'Upload',
          action: 'VIDEO_SUBMITED',
          label: 'N/A'
        });
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
        traceEvent({
          category: 'Upload',
          action: 'VIDEO_PRELOADED',
          label: 'N/A'
        });
        dispatch(preloadSequentialImages(assetID));
        break;
      case UploadPhaseEnum.IMAGES_PRELOADED:
        traceEvent({
          category: 'Upload',
          action: 'IMAGES_PRELOADED',
          label: 'N/A'
        });
        dispatch(setMosaicFormatting({ duration: uploadDuration, videoWidth: resizedWidth, canvasWidth}));
        dispatch(setVideoUploadCount({increment: 1}));
        dispatch(setUploadPhase({uploadPhase: UploadPhaseEnum.MOSAIC_INITIALIZED}));
        break;
      case UploadPhaseEnum.MOSAIC_INITIALIZED:
        traceEvent({
          category: 'Upload',
          action: 'MOSAIC_INITIALIZED',
          label: 'N/A'
        });
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

  return (
    <PopOver
      width={`${displaySize.width}px`}
      height={`${displaySize.height}px`}
      showTop={`0px`}
      hideTop={`${displaySize.height}px`}
      isActive={isActive}
    >
      <div className={classes.container} style={{ width: displaySize.width, height: displaySize.height }}>
        <div className={classes.centerScreen}>

          <SlideInOut 
            isActive={uploadPhase === UploadPhaseEnum.PROMPT}
            enter={`${0.2 * displaySize.height}px`}
            exit={`${displaySize.height}px`}
          >
            <Paper className={classes.promptBody}>
              <div className={classes.promptHeadline}><LibraryAdd style={{ fontSize: 24 }}/> Add Video</div>
              <div>Add a video from your photo library that is fifteen seconds or less.</div>
              <div className={classes.promptButtonsContainer}>
                <input
                  accept="video/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={onFormSubmit}
                />
                <label htmlFor="contained-button-file">
                  <Button               
                    variant='outlined'
                    component='span'
                  > 
                    Upload
                  </Button>
                </label>
    
                <Button
                  variant='outlined'
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </Paper>
          </SlideInOut>
          

          <SlideInOut 
            isActive={uploadPhase === UploadPhaseEnum.VIDEO_SUBMITED || uploadPhase === UploadPhaseEnum.VIDEO_UPLOADING || uploadPhase === UploadPhaseEnum.VIDEO_UPLOADED ||  uploadPhase === UploadPhaseEnum.VIDEO_PRELOADED || uploadPhase === UploadPhaseEnum.IMAGES_PRELOADED || uploadPhase === UploadPhaseEnum.MOSAIC_INITIALIZED }
            enter={`${0.2 * displaySize.height}px`}
            exit={`${displaySize.height}px`}
          >
            <Paper className={classes.promptBody}>
              <div className={classes.promptHeadline}><CloudUpload style={{ fontSize: 26}}/>Video Uploading</div>
              <div>Your video is being uploaded and optimized for your mobile device. This process usually takes ten to fifteen seconds.</div>
              <div>
                <CircularProgress />
              </div>
            </Paper>
          </SlideInOut>


          <SlideInOut 
            isActive={uploadPhase === UploadPhaseEnum.VIDEO_TOO_LONG}
            enter={`${0.2 * displaySize.height}px`}
            exit={`${displaySize.height}px`}
          >
            <Paper className={classes.promptBody}>
              <div className={classes.promptHeadline}><span className={classes.alertHeadline}><Warning style={{ fontSize: 26}}/>Video Too Long</span></div>
              <div>The duration of your video is {Number(uploadDuration).toFixed(2)} seconds long. Please upload a video that is fifteen seconds or less.</div>
              <div className={classes.promptButtonsContainer}>
                <input
                  accept="video/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={onFormSubmit}
                />
                <label htmlFor="contained-button-file">
                  <Button               
                    variant='outlined'
                    component='span'
                  > 
                    Upload
                  </Button>
                </label>
    
                <Button
                  variant='outlined'
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </Paper>
          </SlideInOut>
        </div>

      </div>
    </PopOver>
  );
}

export default UploadVideo;