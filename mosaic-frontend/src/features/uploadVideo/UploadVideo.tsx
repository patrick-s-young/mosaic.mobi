import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Redux Toolkit
import type { RootState } from 'app/rootReducer';
// <App>
import { setAppPhase, AppPhaseEnum } from 'app/appSlice';
import type { AppState } from 'app/appSlice';
// <UploadVideo>
import { 
  UploadPhaseEnum,
  setUploadPhase } from 'features/uploadVideo/uploadSlice';
// api
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages } from 'api';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
// <MosaicTiles>
import { setMosaicFormatting, setMosaicPhase, MosaicPhaseEnum } from 'features/mosaicVideo/mosaicSlice';
// <Navigation>
import { setNavPhase, NavPhaseEnum } from 'features/navigation/navSlice';
// Components
import PopOver from 'components/PopOver';
import SlideInOut from 'components/SlideInOut';
// Material-UI
import { Button, Paper } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Warning, LibraryAdd, CloudUpload } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
// scrubberSlice
import { setVideoUploadCount } from 'features/mosaicImage/scrubberSlice';


const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    container: {
      position: 'absolute',
      backgroundColor: theme.palette.common.white, 
      marginTop: '0px',
      opacity: 0.98,
      zIndex: 20
    },
    centerScreen: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    input: {
      display: 'none',
    },
    alertHeadline: {
      color: theme.palette.secondary.dark,
    },
    promptHeadline: {
      color: theme.palette.primary.dark,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.typography.h5
    },
    promptBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& > *': {
        padding: theme.spacing(1)
      },
      margin: theme.spacing(4),
      padding: theme.spacing(1)
    }
  })
);



export interface UploadVideoProps {
  displaySize: { width: number, height: number }
  isActive: boolean
}

export const UploadVideo: React.FC<UploadVideoProps> = ({ displaySize, isActive }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { canvasWidth } = useSelector<RootState, AppState>((state) => state.app);
  const { uploadPhase, 
          assetID, 
          selectedFile,
          uploadDuration,
          resizedWidth } = useSelector<RootState, UploadState>((state) => state.upload); 
  console.log(`uploadPhase: ${UploadPhaseEnum[uploadPhase]}\n\n`);


  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:
        if (selectedFile !== undefined) {
          dispatch(uploadUserVideo(selectedFile));
          dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
        }
        break;
      case UploadPhaseEnum.VIDEO_UPLOADED:
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

  function onFormSubmit (event) {
    dispatch(preUploadValidation(event));
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
              <div>
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
              <div>
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
            </div>
            </Paper>
          </SlideInOut>
        </div>

      </div>
    </PopOver>
  );
}