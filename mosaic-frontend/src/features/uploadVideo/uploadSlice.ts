import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum UploadPhaseEnum {
  PROMPT,
  UPLOADING_VIDEO,
  PRELOADING_VIDEO,
  PRELOADING_IMAGES
}

export interface UploadPhase {
  uploadPhase: UploadPhaseEnum
}

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

export type UploadState = VideoIsUploaded & VideoIsPreloaded & ImagesArePreloaded & VideoDuration & UploadPhase

const initialState: UploadState = {
  videoIsUploaded: false,
  assetID: '',
  duration: 0,
  videoIsPreloaded: false,
  videoURL: '',
  imagesArePreloaded: false,
  imageURLs: [],
  uploadPhase: UploadPhaseEnum.PROMPT
}

const uploadSlice = createSlice ({
  name: 'upload',
  initialState,
  reducers: {
    setVideoDuration (state, action: PayloadAction<VideoDuration>) {
      state.duration = action.payload.duration;
      state.uploadPhase = UploadPhaseEnum.UPLOADING_VIDEO;
    },
    setVideoIsUploaded (state, action: PayloadAction<VideoIsUploaded>) {
      state.videoIsUploaded = true;
      state.assetID = action.payload.assetID;
      state.uploadPhase = UploadPhaseEnum.PRELOADING_VIDEO;
    },
    setVideoIsPreloaded (state, action: PayloadAction<VideoIsPreloaded>) {
      state.videoIsPreloaded = true;
      state.videoURL = action.payload.videoURL;
      state.uploadPhase = UploadPhaseEnum.PRELOADING_IMAGES;
    },
    setImagesArePreloaded (state, action: PayloadAction<ImagesArePreloaded>) {
      state.imagesArePreloaded = true;
      state.imageURLs = action.payload.imageURLs;
      state.videoIsUploaded = false;
      state.videoIsPreloaded = false;
      state.imagesArePreloaded = false;
      state.uploadPhase = UploadPhaseEnum.PROMPT;
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