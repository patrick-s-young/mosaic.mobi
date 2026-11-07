export interface FileIOPromptProps {
  action: 'render' | 'save' | 'rendering' | 'upload' | 'uploading' | 'videoTooLong' | 'uploadFailed' | 'renderFailed'
  videoDuration?: number
  callBack?: () => void
  onCancel?: () => void
  messageOverride?: string
  buttonLabelOverride?: string
  showCancel?: boolean
}