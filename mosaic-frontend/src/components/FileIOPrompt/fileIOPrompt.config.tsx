import { AccessTime, Cached, CloudDownload, CloudUpload, Warning } from '@material-ui/icons';

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
    message: 'Your video is being uploaded and optimized for your mobile device. This process usually takes ten to fifteen seconds.',
    buttonLabel: '',
  }
}

export { PROMPT };
