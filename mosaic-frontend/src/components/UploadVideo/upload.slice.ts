import { createSlice,  PayloadAction } from '@reduxjs/toolkit';
import { 
  preUploadValidation,
  uploadUserVideo,
  preloadUserVideo,
  preloadSequentialImages 
} from '@api/index';
import { UploadPhaseEnum } from '@enums/UploadPhaseEnum';
import type { Failure, UploadState, UploadDuration, UploadSelectedFile } from  '@typescript/types'
import { UploadPhase } from '@interfaces/UploadPhase';
import { MAX_VIDEO_UPLOAD_DURATION, SCRUBBER_FRAMES_MAX, defaultVideoConfig } from '@/app.config';
import { setFrameURL, setPreviewURL, setUploadProgress } from '@api/assetLoading';


const initialState: UploadState = {
  uploadPhase: UploadPhaseEnum.VIDEO_UPLOADED,
  selectedFile: undefined,
  assetID: defaultVideoConfig.assetID,
  uploadDuration: defaultVideoConfig.uploadDuration,
  videoURL: '',
  videoURL9x16: '',
  imageURLs: [],
  imageURLs9x16: [],
  imageFilenames: [],
  resizedWidth: 320,
  statusMessage: '',
  failure: undefined,
  uploadProgress: { stage: 'loading', fraction: 0 },
  hasAudio: false
}

// every step of the upload chain ends here when it fails, so the user always
// gets a way out instead of waiting on a prompt that will never change
const failUpload = (state: UploadState, failure: Failure | undefined) => {
  state.failure = failure ?? { stage: 'upload', reason: 'server_error' };
  state.uploadPhase = UploadPhaseEnum.UPLOAD_FAILED;
};

const uploadSlice = createSlice ({
  name: 'upload',
  initialState,
  reducers: {
    setUploadPhase (state, action: PayloadAction<UploadPhase>) {
      state.uploadPhase = action.payload.uploadPhase;
      state.failure = undefined;
    },
    setVideoSubmitted (state, action: PayloadAction<UploadDuration & UploadSelectedFile>) {
      state.uploadDuration = action.payload.uploadDuration;
      state.selectedFile = action.payload.selectedFile;
      state.uploadPhase = UploadPhaseEnum.VIDEO_SUBMITED;
    }
  },
  extraReducers: builder => {
    // Step 1: confirm user video is within 30 second duration limit
    builder.addCase(preUploadValidation.rejected, (state, action) => {
      failUpload(state, action.payload);
    })
    builder.addCase(preUploadValidation.pending, (_, action) => {
      console.log(`preUploadValidation.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(preUploadValidation.fulfilled, (state, action) => {
      state.uploadDuration = action.payload.uploadDuration;
      if (state.uploadDuration > MAX_VIDEO_UPLOAD_DURATION) {
        state.uploadPhase = UploadPhaseEnum.VIDEO_TOO_LONG;
      } else {
        state.selectedFile = action.payload.selectedFile;
        state.uploadProgress = { stage: 'sending', fraction: 0 };
        state.uploadPhase = UploadPhaseEnum.VIDEO_SUBMITED;
      }
    })
    // Step 2: upload user video
    builder.addCase(uploadUserVideo.rejected, (state, action) => {
      // cancelled by the user, so back to the upload prompt rather than an error
      if (action.meta.aborted) {
        state.uploadPhase = UploadPhaseEnum.PROMPT;
        return;
      }
      failUpload(state, action.payload);
    })
    builder.addCase(uploadUserVideo.pending, (state) => {
      state.uploadProgress = { stage: 'sending', fraction: 0 };
    })
    builder.addCase(uploadUserVideo.fulfilled, (state, action) => {
      state.assetID = action.payload.assetID;
      state.hasAudio = action.payload.hasAudio === true;
      state.uploadProgress = { stage: 'loading', fraction: 0 };
      state.uploadPhase = UploadPhaseEnum.VIDEO_UPLOADED;
    })
    // Step 3: preload user video to allow auto play in mobile browsers
    builder.addCase(preloadUserVideo.rejected, (state, action) => {
      failUpload(state, action.payload);
    })
    builder.addCase(preloadUserVideo.pending, (_, action) => {
      console.log(`preloadUserVideo.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(preloadUserVideo.fulfilled, (state, action) => {
      // a new video, so nothing from the previous one carries over
      const { aspectRatio, url } = action.payload;
      state.videoURL = aspectRatio === '9x16' ? '' : url;
      state.videoURL9x16 = aspectRatio === '9x16' ? url : '';
      state.imageURLs = Array(SCRUBBER_FRAMES_MAX).fill('');
      state.imageURLs9x16 = Array(SCRUBBER_FRAMES_MAX).fill('');
      state.uploadPhase = UploadPhaseEnum.VIDEO_PRELOADED;
    })
    // Step 4: preload sequential images exported from user video
    builder.addCase(preloadSequentialImages.rejected, (state, action) => {
      failUpload(state, action.payload);
    })
    builder.addCase(preloadSequentialImages.pending, (_, action) => {
      console.log(`preloadSequentialImages.pending > action.payload: ${action.payload}`);
    })
    builder.addCase(preloadSequentialImages.fulfilled, (state, action) => {
      const { aspectRatio, index, url } = action.payload;
      (aspectRatio === '9x16' ? state.imageURLs9x16 : state.imageURLs)[index] = url;
      state.imageFilenames = action.payload.imageFilenames;
      state.uploadPhase = UploadPhaseEnum.IMAGES_PRELOADED;
    })
    builder.addCase(setUploadProgress, (state, action) => {
      state.uploadProgress = action.payload;
    })
    builder.addCase(setPreviewURL, (state, action) => {
      const { assetID, aspectRatio, url } = action.payload;
      if (assetID !== state.assetID) return;
      if (aspectRatio === '9x16') state.videoURL9x16 = url;
      else state.videoURL = url;
    })
    builder.addCase(setFrameURL, (state, action) => {
      const { assetID, aspectRatio, index, url } = action.payload;
      if (assetID !== state.assetID) return;
      (aspectRatio === '9x16' ? state.imageURLs9x16 : state.imageURLs)[index] = url;
    })
  }
});

export const {
  setVideoSubmitted,
  setUploadPhase
} = uploadSlice.actions;

export default uploadSlice.reducer;