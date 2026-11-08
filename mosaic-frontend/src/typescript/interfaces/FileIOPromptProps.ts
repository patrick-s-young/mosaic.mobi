import type { UploadProgress } from '@typescript/types';

export interface FileIOPromptProps {
  action: 'rendering' | 'exportReady' | 'upload' | 'uploading' | 'trim' | 'uploadFailed' | 'renderFailed'
  callBack?: () => void
  onCancel?: () => void
  headlineOverride?: string
  messageOverride?: string
  buttonLabelOverride?: string
  cancelLabelOverride?: string
  showCancel?: boolean
  isActive?: boolean
  uploadProgress?: UploadProgress
  renderDownloadFraction?: number
  children?: React.ReactNode
}