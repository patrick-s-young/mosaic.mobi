import { UploadPhaseEnum } from '@enums/UploadPhaseEnum';
import { UploadAssetID, UploadDuration, UploadVideoURL, UploadSelectedFile } from '@typescript/types';

export type UploadState = 
  & UploadAssetID 
  & UploadDuration 
  & UploadVideoURL 
  & UploadSelectedFile
  & { statusMessage: string,
      uploadPhase: UploadPhaseEnum,
      resizedWidth: number,
      videoURL9x16: string,
      imageURLs: Array<string>,
      imageURLs9x16: Array<string>,
      imageFilenames: Array<string>,
      downloadFileName: string
    }