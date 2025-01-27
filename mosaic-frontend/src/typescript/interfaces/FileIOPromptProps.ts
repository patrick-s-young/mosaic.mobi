export interface FileIOPromptProps {
  action: 'render' | 'save' | 'rendering' | 'upload' | 'uploading' | 'videoTooLong'
  videoDuration?: number
  callBack?: () => void
  onCancel?: () => void
}