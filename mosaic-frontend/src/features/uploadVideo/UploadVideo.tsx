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
  preloadSequentialImages, 
  preloadVideo, 
  uploadFile } from 'utils';
import { 
  setVideoSubmitted,
  setVideoIsUploaded, 
  setVideoIsPreloaded, 
  setImagesArePreloaded, 
  UploadPhaseEnum,
  setUploadPhase } from 'features/uploadVideo/uploadSlice';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import loadingAnim from 'assets/images/loading_200x200.gif';
import 'features/uploadVideo/uploadVideo.css';
// <MosaicTiles>
import { setMosaicFormatting } from 'features/mosaicVideo/mosaicSlice';
// <Navigation>
import { setNavPhase, NavPhaseEnum } from 'features/navigation/navSlice';
// <PopOver>
import PopOver from 'components/PopOver';
// Material-UI
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';


///// TEST VALUES ///////
const isTesting: boolean = false;
const testAssetID: string = 'test-video';
const testAssetDuration: number = 8.0;
//////////////////////////
///////////////////////////


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
        if ( isTesting ) {
          dispatch(setVideoIsUploaded({ assetID: testAssetID }));
        } else {
          if (selectedFile !== undefined) {
            uploadFile(selectedFile, '/uploadvideo')
              .then(assetID => dispatch(setVideoIsUploaded({ assetID })))
              .catch(error => console.log(error));
          }
        }
        break;
      case UploadPhaseEnum.VIDEO_UPLOADED:
        const videoPath = !isTesting ? `/uploads/${assetID}/resized.mov` : `/${testAssetID}/resized.mov`;
        preloadVideo(videoPath)
          .then(videoURL => dispatch(setVideoIsPreloaded({ videoURL })))
          .catch(err => console.log(`ERROR > preloadVideo: ${err}`));
        break;
      case UploadPhaseEnum.VIDEO_PRELOADED:
        preloadSequentialImages({
          startIdx: 1,
          endIdx: 20,
          nameFormat: 'img .jpg',
          zeroPadding: 3,
          directoryPath: !isTesting ? `/uploads/${assetID}` : `/${testAssetID}`})
          .then(imageURLs => dispatch(setImagesArePreloaded({ imageURLs })))
          .catch(err => console.log(`ERROR > preloadSequentialImages: ${err}`));
        break;
      case UploadPhaseEnum.IMAGES_PRELOADED:
        dispatch(setMosaicFormatting({ duration: uploadDuration, videoWidth: resizedWidth, canvasWidth}));
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
    if (isTesting) {
      dispatch(setVideoSubmitted({ selectedFile: undefined, uploadDuration: testAssetDuration}));
      return;
    }
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
      const blob: Blob = new Blob( [ evt.target.result ], { type: "video/mp4" } );
      const urlCreator = window.URL || window.webkitURL;
      var videoUrl = urlCreator.createObjectURL( blob );
      var video = document.createElement('video');
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', (ev: Event) => {
        const target = ev.currentTarget as HTMLVideoElement;
        console.log(`duration: ${target.duration}`);
        urlCreator.revokeObjectURL(videoUrl);
        dispatch(setVideoSubmitted({ selectedFile, uploadDuration: target.duration }));
      });
    }
    // read file to determine if duration is not too long (less than fifteen seconds)
    reader.readAsArrayBuffer(selectedFile);
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