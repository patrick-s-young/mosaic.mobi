import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages 
} from '@api/index';
import { UploadPhaseEnum } from '@enums/UploadPhaseEnum';
import type { UploadState, UploadDuration, UploadSelectedFile } from  '@typescript/types'
import { UploadPhase } from '@interfaces/UploadPhase';
import { MAX_VIDEO_UPLOAD_DURATION, defaultVideoConfig } from '@/app.config';


const initialState: UploadState = {
  uploadPhase: UploadPhaseEnum.VIDEO_UPLOADED,
  selectedFile: undefined,
  downloadFileName: '',
  assetID: defaultVideoConfig.assetID,
  uploadDuration: defaultVideoConfig.uploadDuration,
  videoURL: '',
  imageURLs: [],
  imageFilenames: [],
  resizedWidth: 320,
  statusMessage: ''
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
    }
  },
  extraReducers: builder => {
    // Step 1: confirm user video is within 30 second duration limit
    builder.addCase(preUploadValidation.rejected, (_, action) => {
      console.warn(`preUploadValidation.rejected > action.payload: ${action.payload}`);
    })
    builder.addCase(preUploadValidation.pending, (_, action) => {
      console.log(`preUploadValidation.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(preUploadValidation.fulfilled, (state, action) => {
      const regex = new RegExp(/\.[^/.]+$/); 
      state.uploadDuration = action.payload.uploadDuration;
      if (state.uploadDuration > MAX_VIDEO_UPLOAD_DURATION) {
        state.uploadPhase = UploadPhaseEnum.VIDEO_TOO_LONG;
      } else {
        state.selectedFile = action.payload.selectedFile;
        state.downloadFileName = action.payload.selectedFile.name.replace(regex, '_mosaic.mov');
        state.uploadPhase = UploadPhaseEnum.VIDEO_SUBMITED;
      }
    }) 
    // Step 2: upload user video
    builder.addCase(uploadUserVideo.rejected, (_, action) => {
      console.warn(`uploadUserVideo.rejected > action.payload: ${action.payload}`);
    })
    builder.addCase(uploadUserVideo.pending, (state, action) => {
      state.statusMessage = 'Uploading and optimizing video. This may take 10-15 seconds (production vers will be faster)';
      console.log(`uploadUserVideo.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(uploadUserVideo.fulfilled, (state, action) => {
      state.assetID = action.payload.assetID;
      state.uploadPhase = UploadPhaseEnum.VIDEO_UPLOADED;
    })
    // Step 3: preload user video to allow auto play in mobile browsers
    builder.addCase(preloadUserVideo.rejected, (_, action) => {
      console.warn(`preloadUserVideo.rejected > action.payload: ${action.payload}`);
    })
    builder.addCase(preloadUserVideo.pending, (_, action) => {
      console.log(`preloadUserVideo.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(preloadUserVideo.fulfilled, (state, action) => {
      state.videoURL = action.payload.videoURL;
      state.uploadPhase = UploadPhaseEnum.VIDEO_PRELOADED;
    })
    // Step 4: preload sequential images exported from user video
    builder.addCase(preloadSequentialImages.rejected, (_, action) => {
      console.warn(`preloadSequentialImages.rejected > action.payload: ${action.payload}`);
    })
    builder.addCase(preloadSequentialImages.pending, (_, action) => {
      console.log(`preloadSequentialImages.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(preloadSequentialImages.fulfilled, (state, action) => {
      state.imageURLs = action.payload.imageURLs;
      state.imageFilenames = action.payload.imageFilenames;
      state.uploadPhase = UploadPhaseEnum.IMAGES_PRELOADED;
    })
  }
});

export const {
  setVideoSubmitted,
  setUploadPhase
} = uploadSlice.actions;

export default uploadSlice.reducer;