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
import loadingAnim from 'assets/images/loading_200x200.gif';
// <MosaicTiles>
import { setMosaicFormatting, setMosaicPhase, MosaicPhaseEnum } from 'features/mosaicVideo/mosaicSlice';
// <Navigation>
import { setNavPhase, NavPhaseEnum } from 'features/navigation/navSlice';
// <PopOver>
import PopOver from 'components/PopOver';
// Material-UI
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// scrubberSlice
import { setVideoUploadCount } from 'features/mosaicImage/scrubberSlice';


const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute', 
    marginTop: '0px',
    opacity: 0.95,
    backgroundColor: '#ffffff',
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
  }
}));


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
          resizedWidth} = useSelector<RootState, UploadState>((state) => state.upload); 
  console.log(`uploadPhase: ${UploadPhaseEnum[uploadPhase]}\n\n`);


  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:
        dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
        if (selectedFile !== undefined) dispatch(uploadUserVideo(selectedFile));
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
        {
          uploadPhase === UploadPhaseEnum.PROMPT &&
            <div className={classes.centerScreen}>
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
                  size='large'
                  component='span'
                > 
                  Upload
                </Button>
              </label>
            </div>
        }
        {
          uploadPhase !== UploadPhaseEnum.PROMPT &&
            <div className={classes.centerScreen}>
              <img src={loadingAnim}  />
            </div>
        }
      </div>
    </PopOver>
  );
}