// sending: bytes going up. processing: the server is preparing the video.
// loading: the preview is coming back down.
export type UploadProgress = {
  stage: 'sending' | 'processing' | 'loading'
  fraction: number
}
