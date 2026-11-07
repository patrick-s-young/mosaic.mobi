import { useEffect, useState } from 'react';
import { PROMPT } from './fileIOPrompt.config';
import PromptButton from '@/components/FileIOPrompt/PromptButton';
import { FileIOPromptProps } from '@interfaces/FileIOPromptProps';
import { io, Socket } from 'socket.io-client';
import './fileIOPrompt.scss';

// shared by every prompt, so a visitor holds one connection however many are mounted
let socket: Socket | undefined;

const FileIOPrompt = ({
  action,
  videoDuration = 0,
  callBack = () => {},
  onCancel = () => {},
  messageOverride,
  buttonLabelOverride,
  showCancel = true
}: FileIOPromptProps) => {
  const [progressFrames, setProgressFrames] = useState({actionName: null, currentFrame: 0, totalFrames: 0});
  const { headline, headlineIcon, message, buttonLabel } = PROMPT[action];
  const formattedMessage = messageOverride ?? (action === 'videoTooLong'
  ? message.replace('VIDEO_DURATION', Number(videoDuration).toFixed(2))
  : message);
  const showButtons = action !== 'rendering' && action !== 'uploading';

  // Temp solution. Replace with upload status method
  const statusMessage = () => {
    return progressFrames.actionName
      ? <>{progressFrames.actionName} frame <span style={{ display: "inline-block", width: "3ch", textAlign: "right" }}>{progressFrames.currentFrame}</span> of {progressFrames.totalFrames}</>
      : <>Uploading Video...</>
  }

  useEffect(() => {
    socket = socket ?? io();
    const onProgress = (data: any) => {
      setProgressFrames({actionName: data.actionName, currentFrame: data.currentFrame, totalFrames: data.totalFrames});
    };
    socket.on('ffmpegProgress', onProgress);
    return () => {
      socket?.off('ffmpegProgress', onProgress);
    };
  }, []);

  return (
    <div className='fileIOPrompt'>
      <div className='fileIOPrompt__headline'>
        {headlineIcon} {headline}
      </div>
      <div>
        {!showButtons && 
          <p className='fileIOPrompt__progressMessage'>
            {statusMessage()}
          </p>
        }
        {formattedMessage}
      </div>
      {showButtons &&
        <div className='fileIOPrompt__buttonsContainer'>
          <PromptButton prompt={buttonLabelOverride ?? buttonLabel} onClick={callBack} />
          {showCancel && <PromptButton prompt="CANCEL" onClick={onCancel} />}
        </div>
      }
    </div>
  )
}

export default FileIOPrompt;
