import { useEffect, useState } from 'react';
import { PROMPT } from './fileIOPrompt.config';
import PromptButton from '@/components/FileIOPrompt/PromptButton';
import { FileIOPromptProps } from '@interfaces/FileIOPromptProps';
import { io, Socket } from 'socket.io-client';
import './fileIOPrompt.scss';

let socket: Socket;

const FileIOPrompt = ({ action, videoDuration = 0, callBack = () => {}, onCancel = () => {} }: FileIOPromptProps) => {
  const [progressMessage, setProgressMessage] = useState('Processing frame 0 of 0');
  const { headline, headlineIcon, message, buttonLabel } = PROMPT[action];
  const formattedMessage = action === 'videoTooLong' 
  ? message.replace('VIDEO_DURATION', Number(videoDuration).toFixed(2)) 
  : message;
  const showButtons = action !== 'rendering' && action !== 'uploading';

  useEffect(() => {
    socket = io();
    socket.on('ffmpegProgress', 
      (data: { currentFrame: number, totalFrames: number }) => {
                  setProgressMessage(`Processing frame ${data.currentFrame} of ${data.totalFrames}`);
                }
    );
  }, []);

  return (
    <div className='fileIOPrompt'>
      <div className='fileIOPrompt__headline'>
        {headlineIcon} {headline}
      </div>
      <div>
        {!showButtons && <p className='fileIOPrompt__progressMessage'>{progressMessage}</p>}
        {formattedMessage}
      </div>
      {showButtons &&
        <div className='fileIOPrompt__buttonsContainer'>
          <PromptButton prompt={buttonLabel} onClick={callBack} />
          <PromptButton prompt="CANCEL" onClick={onCancel} />
        </div>
      }
    </div>
  )
}

export default FileIOPrompt;
