export enum UploadPhaseEnum {
  PROMPT,
  VIDEO_TOO_LONG,
  VIDEO_UPLOADING,
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
  & { statusMessage: string }