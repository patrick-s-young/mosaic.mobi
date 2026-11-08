import { useEffect, useRef, useState } from 'react';
import { PROMPT } from './fileIOPrompt.config';
import { FrameProgress, getRenderProgress, getUploadProgress } from './fileIOPrompt.progress';
import PromptButton from '@/components/FileIOPrompt/PromptButton';
import { FileIOPromptProps } from '@interfaces/FileIOPromptProps';
import { io, Socket } from 'socket.io-client';
import { getSessionId } from '@api/reportFailure';
import './fileIOPrompt.scss';

// shared by every prompt, so a visitor holds one connection however many are mounted
let socket: Socket | undefined;

const NO_PROGRESS: FrameProgress = { actionName: null, currentFrame: 0, totalFrames: 0 };

const FileIOPrompt = ({
  action,
  callBack = () => {},
  onCancel = () => {},
  headlineOverride,
  messageOverride,
  buttonLabelOverride,
  cancelLabelOverride,
  showCancel = true,
  isActive = false,
  uploadProgress,
  renderDownloadFraction = 0,
  children
}: FileIOPromptProps) => {
  const [progressFrames, setProgressFrames] = useState<FrameProgress>(NO_PROGRESS);
  const highestPercent = useRef(0);
  const isActiveRef = useRef(false);
  const { headline, headlineIcon, message, buttonLabel } = PROMPT[action];
  const formattedMessage = messageOverride ?? message;
  const showButtons = action !== 'rendering' && action !== 'uploading';

  const progress = action === 'uploading' && uploadProgress
    ? getUploadProgress(uploadProgress, progressFrames)
    : getRenderProgress(progressFrames, renderDownloadFraction);
  // each run starts from empty, the bar only moves forward even if a late event
  // arrives out of order, and it holds its value while the card slides away
  if (isActive && !isActiveRef.current) highestPercent.current = 0;
  isActiveRef.current = isActive;
  if (isActive) highestPercent.current = Math.max(highestPercent.current, progress.percent);
  const percent = Math.round(highestPercent.current);

  useEffect(() => {
    if (!isActive) setProgressFrames(NO_PROGRESS);
  }, [isActive]);

  useEffect(() => {
    socket = socket ?? io({ auth: { sessionId: getSessionId() } });
    const onProgress = (data: any) => {
      if (!isActiveRef.current) return;
      setProgressFrames({actionName: data.actionName, currentFrame: Number(data.currentFrame), totalFrames: Number(data.totalFrames)});
    };
    socket.on('ffmpegProgress', onProgress);
    return () => {
      socket?.off('ffmpegProgress', onProgress);
    };
  }, []);

  return (
    <div className='fileIOPrompt'>
      <div className='fileIOPrompt__headline'>
        {headlineIcon} {headlineOverride ?? headline}
      </div>
      <div>
        {children}
        {!showButtons &&
          <div className='fileIOPrompt__progress'>
            <p className='fileIOPrompt__progressMessage' aria-live='polite'>{progress.label}</p>
            <div
              className='fileIOPrompt__progressTrack'
              role='progressbar'
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <div className='fileIOPrompt__progressFill' style={{ width: `${percent}%` }} />
            </div>
          </div>
        }
        {formattedMessage}
      </div>
      {(action === 'rendering' || (action === 'uploading' && uploadProgress?.stage === 'sending')) &&
        <PromptButton prompt="CANCEL" onClick={onCancel} />
      }
      {showButtons &&
        <div className={`fileIOPrompt__buttonsContainer ${showCancel ? '' : 'fileIOPrompt__buttonsContainer--single'}`}>
          <PromptButton prompt={buttonLabelOverride ?? buttonLabel} onClick={callBack} primary={action === 'exportReady' || action === 'trim'} />
          {showCancel && <PromptButton prompt={cancelLabelOverride ?? 'CANCEL'} onClick={onCancel} />}
        </div>
      }
    </div>
  )
}

export default FileIOPrompt;
