import { AccessTime, Cached, CloudDownload, CloudUpload, Warning } from '@material-ui/icons';
import { MAX_VIDEO_UPLOAD_MB } from '@/app.config';
import type { Failure, FailureReason } from '@typescript/types';

const ICON_SIZE = 36;

const PROMPT = {
  render: {
    headline: 'RENDER VIDEO',
    headlineIcon: <AccessTime style={{ fontSize: ICON_SIZE }}/>,
    message: 'The mosaic video rendering process takes place in the cloud and usually requires ten to fifteen seconds.',
    buttonLabel: 'RENDER',
  },
  rendering: {
    headline: 'RENDERING VIDEO',
    headlineIcon: <Cached style={{ fontSize: ICON_SIZE }}/>,
    message: 'When rendering is complete, you will be prompted to download your mosaic video to your device.',
    buttonLabel: '',
  },
  save: {
    headline: 'SAVE VIDEO',
    headlineIcon: <CloudDownload style={{ fontSize: ICON_SIZE }}/>,
    message: 'Your mosaic video is ready to save to your device. If you don\'t have the option to save to your photo library, save to files first and then add it to your photos.',
    buttonLabel: 'SAVE',
  },
  upload: {
    headline: 'UPLOAD VIDEO',
    headlineIcon: <CloudUpload style={{ fontSize: ICON_SIZE }}/>,
    message: 'Add a video from your photo library that is fifteen seconds or less.',
    buttonLabel: 'UPLOAD',
  },
  videoTooLong: {
    headline: 'VIDEO TOO LONG',
    headlineIcon: <Warning style={{ fontSize: ICON_SIZE }}/>,
    message: 'The duration of your video is VIDEO_DURATION seconds long. Please upload a video that is fifteen seconds or less.',
    buttonLabel: 'UPLOAD',
  },
  uploading: {
    headline: 'UPLOADING',
    headlineIcon: <CloudUpload style={{ fontSize: ICON_SIZE }}/>,
    message: 'Your video is being uploaded and optimized for your mobile device.',
    buttonLabel: '',
  },
  uploadFailed: {
    headline: 'UPLOAD FAILED',
    headlineIcon: <Warning style={{ fontSize: ICON_SIZE }}/>,
    message: '',
    buttonLabel: 'TRY AGAIN',
  },
  renderFailed: {
    headline: 'RENDER FAILED',
    headlineIcon: <Warning style={{ fontSize: ICON_SIZE }}/>,
    message: '',
    buttonLabel: 'TRY AGAIN',
  }
}

const COULD_NOT_PROCESS = 'We couldn\'t process this video. Please try a different one.';
const SERVER_BUSY = 'Our server is busy right now. Please try again in a moment.';
const CHECK_CONNECTION = 'The connection was interrupted. Please check it and try again.';

const FAILURE_MESSAGES: Partial<Record<FailureReason, string>> = {
  too_large: `This video is too large. Please choose one under ${MAX_VIDEO_UPLOAD_MB} MB.`,
  too_short: 'This video is too short. Please choose one that is at least two seconds long.',
  unreadable_file: 'We couldn\'t read this video. Please try a different one, such as an MP4 or MOV from your phone.',
  network: CHECK_CONNECTION,
  download_failed: CHECK_CONNECTION,
  timeout: SERVER_BUSY,
  ffmpeg_killed: SERVER_BUSY,
  unreadable_video: COULD_NOT_PROCESS,
  missing_frames: COULD_NOT_PROCESS,
  ffmpeg_failed: COULD_NOT_PROCESS,
  asset_expired: 'Your upload has expired. Please upload your video again.'
};

const failureMessage = (failure: Failure | undefined): string =>
  (failure && FAILURE_MESSAGES[failure.reason]) ?? 'Something went wrong. Please try again.';

export { PROMPT, failureMessage };
