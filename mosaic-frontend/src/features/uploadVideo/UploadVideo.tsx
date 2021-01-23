import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { setMosaicFormatting } from 'features//mosaicVideo/mosaicSlice';
import { setNavSection } from 'features/navigation/navSlice';
import type { RootState } from 'app/rootReducer';
import loadingAnim from 'assets/images/loading_200x200.gif';
import 'features/uploadVideo/uploadVideo.css';

///// TEST VALUES ///////
const isTesting: boolean = true;
const testAssetID: string = 'test-video';
const testAssetDuration: number = 8.0;

///// UploadVideo ///////
export const UploadVideo: React.FC = () => {
  const dispatch = useDispatch();
  const { uploadPhase, 
          assetID, 
          selectedFile,
          canvasWidth,
          uploadDuration,
          resizedWidth} = useSelector<RootState, UploadState>((state) => state.upload); 
  console.log(`uploadPhase: ${UploadPhaseEnum[uploadPhase]}\n\n`);


  useEffect(() => {
    switch(uploadPhase) {
      case UploadPhaseEnum.VIDEO_SUBMITED:
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
          .then(videoURL => dispatch(setVideoIsPreloaded({ videoURL, canvasWidth: window.innerWidth })))
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
        dispatch(setNavSection({navSection: 'Edit Mosaic'}));      
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
    <div style={{position: 'absolute', width: '100vw', top: `0px`, zIndex: 5, opacity: 0.9}}>
      {uploadPhase === UploadPhaseEnum.PROMPT &&
      <div className='uploadVideo_flex-container'>
        <div className="uploadVideo_button_wrapper">
          <label className="uploadVideo_button_label">
            Upload Video
            <input type="file" className="file-submit" name="myFile" onChange={onFormSubmit}></input>
          </label>
        </div>
      </div>
      }
      {uploadPhase !== UploadPhaseEnum.PROMPT &&
        <div className='uploadVideo_flex-container'>
        <div className='uploadVideo_loading-animation'>
          <img src={loadingAnim}  alt='Loading..please wait'/>
        </div>
      </div>
      }
    </div>
  )
}