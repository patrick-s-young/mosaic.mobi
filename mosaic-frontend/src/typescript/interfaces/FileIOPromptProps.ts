import type { UploadProgress } from '@typescript/types';

export interface FileIOPromptProps {
  action: 'render' | 'save' | 'rendering' | 'upload' | 'uploading' | 'videoTooLong' | 'uploadFailed' | 'renderFailed'
  videoDuration?: number
  callBack?: () => void
  onCancel?: () => void
  headlineOverride?: string
  messageOverride?: string
  buttonLabelOverride?: string
  showCancel?: boolean
  isActive?: boolean
  uploadProgress?: UploadProgress
}