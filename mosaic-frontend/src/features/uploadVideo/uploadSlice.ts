import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum UploadPhaseEnum {
  PROMPT,
  VIDEO_SUBMITED,
  VIDEO_UPLOADED,
  VIDEO_PRELOADED,
  IMAGES_PRELOADED,
  MOSAIC_INITIALIZED
}

export interface UploadPhase {
  uploadPhase: UploadPhaseEnum
}

export interface UploadAssetID {
  assetID: string
}

export interface UploadDuration {
  uploadDuration: number
}

export interface UploadVideoURL {
  videoURL: string
}

export interface UploadSelectedFile {
  selectedFile: File | undefined
}

export interface UploadImageURLs {
  imageURLs: Array<string>
}

export interface UploadVideoResized {
  resizedWidth: number
}

export type UploadState = 
    UploadPhase 
  & UploadAssetID 
  & UploadDuration 
  & UploadVideoURL 
  & UploadSelectedFile
  & UploadImageURLs
  & UploadVideoResized

const initialState: UploadState = {
  uploadPhase: UploadPhaseEnum.VIDEO_UPLOADED,
  selectedFile: undefined,
  assetID: '330055',
  uploadDuration: 8.0,
  videoURL: '',
  imageURLs: [],
  resizedWidth: 320 // make dynamically linked to video meta data of resized.mov
}

const uploadSlice = createSlice ({
  name: 'upload',
  initialState,
  reducers: {
    setUploadPhase (state, action: PayloadAction<UploadPhase>) {
      state.uploadPhase = action.payload.uploadPhase;
    },
    setVideoSubmitted (state, action: PayloadAction<UploadDuration & UploadSelectedFile>) {
      state.uploadDuration = action.payload.uploadDuration;
      state.selectedFile = action.payload.selectedFile;
      state.uploadPhase = UploadPhaseEnum.VIDEO_SUBMITED;
    },
    setVideoIsUploaded (state, action: PayloadAction<UploadAssetID>) {
      state.assetID = action.payload.assetID;
      state.uploadPhase = UploadPhaseEnum.VIDEO_UPLOADED;
    },
    setVideoIsPreloaded (state, action: PayloadAction<UploadVideoURL>) {
      state.videoURL = action.payload.videoURL;
      state.uploadPhase = UploadPhaseEnum.VIDEO_PRELOADED;
    },
    setImagesArePreloaded (state, action: PayloadAction<UploadImageURLs>) {
      state.imageURLs = action.payload.imageURLs;
      state.uploadPhase = UploadPhaseEnum.IMAGES_PRELOADED;
    }   
  }
});

export const {
  setVideoSubmitted,
  setVideoIsUploaded,
  setVideoIsPreloaded,
  setImagesArePreloaded,
  setUploadPhase
} = uploadSlice.actions;

export type SetVideoSubmitted = ReturnType <typeof setVideoSubmitted>;
export type SetVideoIsUploaded = ReturnType <typeof setVideoIsUploaded>;
export type SetVideoIsPreloaded = ReturnType <typeof setVideoIsPreloaded>;
export type SetImagesArePreloaded = ReturnType <typeof setImagesArePreloaded>;
export type SetUploadPhase = ReturnType <typeof setUploadPhase>;

export default uploadSlice.reducer;