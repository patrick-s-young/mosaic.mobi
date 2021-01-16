import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoDuration, setVideoIsUploaded, setVideoIsPreloaded, setImagesArePreloaded, UploadPhaseEnum } from 'features/uploadVideo/uploadSlice';
import { setNavSection } from 'features/navigation/navSlice';
import type { RootState } from 'app/rootReducer';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import { preloadSequentialImages, preloadVideo, uploadFile } from 'utils';
import { loadVideoMetadata } from 'utils/loadVideoMetadata';
import type { UploadPhase } from 'features/uploadVideo/uploadSlice';

import loadingAnim from 'assets/images/loading_200x200.gif';
import 'features/uploadVideo/uploadVideo.css';

///// TEST VALUES ///////
const isTesting: boolean = false;
const testAssetID: string = 'test-video';

///////////////////
export const UploadVideo: React.FC = () => {
  const dispatch = useDispatch();
  const { videoIsUploaded, 
          videoIsPreloaded, 
          imagesArePreloaded,
          uploadPhase, 
          assetID } = useSelector<RootState, UploadState>((state) => state.upload);

  console.log(`uploadPhase: ${uploadPhase}\n\n`);

  function onSetVideoDuration (duration: number) {
    dispatch(setVideoDuration({ duration }));
  }

  function onVideoIsUploaded (assetID: string) {
    dispatch(setVideoIsUploaded({ videoIsUploaded: true, assetID }));
  }

  function onVideoIsPreloaded (videoURL: string) {
    dispatch(setVideoIsPreloaded({ videoIsPreloaded: true, videoURL }));
  }

  function onImagesArePreloaded (imageURLs: Array<string>) {
    dispatch(setImagesArePreloaded({ imagesArePreloaded: true, imageURLs }));
    dispatch(setNavSection({navSection: 'Edit Mosaic'}));
  }

  function onFormSubmit (event) {

    if (isTesting) {
      onSetVideoDuration(8); // duration of 'src\assets\test-video\resized.mov'
      onVideoIsUploaded(testAssetID);
      return;
    }


    const selectedFile = event.target.files[0];
    console.log(`_selectedFile: ${selectedFile.name}`);
    const reader = new FileReader();
    reader.onload = function(evt) {
      console.log(`_evt.target.result: ${evt.target.result}`);
      const blob: Blob = new Blob( [ evt.target.result ], { type: "video/mp4" } );
      const urlCreator = window.URL || window.webkitURL;
      var videoUrl = urlCreator.createObjectURL( blob );
      var video = document.createElement('video');
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', (ev: Event) => {
        const target = ev.currentTarget as HTMLVideoElement;
        console.log(`duration: ${target.duration}`);
        onSetVideoDuration(target.duration);
        urlCreator.revokeObjectURL(videoUrl);
        uploadVideoFile(selectedFile);
      });
    }
    reader.readAsArrayBuffer(selectedFile);
  }

  function uploadVideoFile (videoFile: File) {
    uploadFile(videoFile, '/uploadvideo')
      .then(assetID => onVideoIsUploaded(assetID))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    if (videoIsUploaded && !videoIsPreloaded) {
      const videoPath = !isTesting ? `/uploads/${assetID}/resized.mov` : `/${testAssetID}/resized.mov`;
      preloadVideo(videoPath)
        .then(videoURL => onVideoIsPreloaded(videoURL))
        .catch(err => console.log(`ERROR: ${err}`));
    }
  }, [videoIsPreloaded, videoIsUploaded, assetID]);

  useEffect(() => {
    if (videoIsUploaded && !imagesArePreloaded) {
      preloadSequentialImages({
        startIdx: 1,
        endIdx: 20,
        nameFormat: 'img .jpg',
        zeroPadding: 3,
        directoryPath: !isTesting ? `/uploads/${assetID}` : `/${testAssetID}`
      })
        .then(imageURLs => onImagesArePreloaded(imageURLs))
        .catch(err => console.log(`ERROR: ${err}`));
    }
  }, [imagesArePreloaded, videoIsUploaded, assetID]);


  return (
    <div>
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