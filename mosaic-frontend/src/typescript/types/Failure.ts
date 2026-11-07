// where in the user's journey something failed, and why. Keep in sync with the
// lists in the backend FailureLogService, which rejects anything else.
export type FailureStage = 'validation' | 'upload' | 'processing' | 'preload' | 'render';

export type FailureReason =
  | 'too_long' | 'too_short' | 'too_large' | 'unreadable_file'
  | 'no_file' | 'network' | 'timeout' | 'server_error'
  | 'unreadable_video' | 'ffmpeg_failed' | 'ffmpeg_killed' | 'missing_frames'
  | 'download_failed' | 'asset_expired' | 'invalid_request' | 'cancelled';

export type Failure = {
  stage: FailureStage
  reason: FailureReason
  status?: number
  detail?: string
  // true when the server has already recorded this failure
  logged?: boolean
}
