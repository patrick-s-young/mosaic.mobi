import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoDuration, setVideoIsUploaded, setVideoIsPreloaded, setImagesArePreloaded } from 'features/uploadVideo/uploadSlice';
import { setNavSection } from 'features/navigation/navSlice';
import type { RootState } from 'app/rootReducer';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import { preloadSequentialImages, preloadVideo, uploadFile } from 'utils';
import { loadVideoMetadata } from 'utils/loadVideoMetadata';

///// TEST VALUES ///////
const isTesting: boolean = false;
const testAssetID: string = '1610144614058';


///////////////////
export const UploadVideo: React.FC = () => {
  const dispatch = useDispatch();
  const { videoIsUploaded, 
          videoIsPreloaded, 
          imagesArePreloaded, 
          assetID } = useSelector<RootState, UploadState>((state) => state.upload);


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

    if (isTesting == true) {
      loadVideoMetadata(`/${testAssetID}/resized.mov`, 1000)
        .then(data => onSetVideoDuration(data.duration))
        .then(() => onVideoIsUploaded(testAssetID));
      return; 
    }


    const selectedFile = event.target.files[0];
    console.log(`selectedFile: ${selectedFile.name}`);
    const reader = new FileReader();
    reader.onload = function(evt) {
      console.log(`evt.target.result: ${evt.target.result}`);
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
      {!videoIsUploaded &&
        <div>
          <label>UPLOAD - VIDEO</label>
          <input id="myFile" type="file" onChange={onFormSubmit} ></input>
        </div>
      }
    </div>
  )
}