import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoIsUploaded {
  videoIsUploaded: boolean
  assetID: string
}

export interface VideoDuration {
  duration: number
}

export interface VideoIsPreloaded {
  videoIsPreloaded: boolean
  videoURL: string
}

export interface ImagesArePreloaded {
  imagesArePreloaded: boolean
  imageURLs: Array<string>
}

export type UploadState = VideoIsUploaded & VideoIsPreloaded & ImagesArePreloaded & VideoDuration

const initialState: UploadState = {
  videoIsUploaded: false,
  assetID: '',
  duration: 0,
  videoIsPreloaded: false,
  videoURL: '',
  imagesArePreloaded: false,
  imageURLs: []
}

const uploadSlice = createSlice ({
  name: 'upload',
  initialState,
  reducers: {
    setVideoDuration (state, action: PayloadAction<VideoDuration>) {
      state.duration = action.payload.duration
    },
    setVideoIsUploaded (state, action: PayloadAction<VideoIsUploaded>) {
      state.videoIsUploaded = true;
      state.assetID = action.payload.assetID;
    },
    setVideoIsPreloaded (state, action: PayloadAction<VideoIsPreloaded>) {
      state.videoIsPreloaded = true;
      state.videoURL = action.payload.videoURL;
    },
    setImagesArePreloaded (state, action: PayloadAction<ImagesArePreloaded>) {
      state.imagesArePreloaded = true;
      state.imageURLs = action.payload.imageURLs;
    }   
  }
});

export const {
  setVideoDuration,
  setVideoIsUploaded,
  setVideoIsPreloaded,
  setImagesArePreloaded
} = uploadSlice.actions;

export type SetVideoDuration = ReturnType <typeof setVideoDuration>;
export type SetVideoIsUploaded = ReturnType <typeof setVideoIsUploaded>;
export type SetVideoIsPreloaded = ReturnType <typeof setVideoIsPreloaded>;
export type SetImagesArePreloaded = ReturnType <typeof setImagesArePreloaded>;

export default uploadSlice.reducer;