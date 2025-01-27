import { PROMPT } from './fileIOPrompt.config';
import PromptButton from '@/components/FileIOPrompt/PromptButton';
import { FileIOPromptProps } from '@interfaces/FileIOPromptProps';
import './fileIOPrompt.scss';


const FileIOPrompt = ({ action, videoDuration = 0, callBack = () => {}, onCancel = () => {} }: FileIOPromptProps) => {
  const { headline, headlineIcon, message, buttonLabel } = PROMPT[action];
  const formattedMessage = action === 'videoTooLong' 
  ? message.replace('VIDEO_DURATION', Number(videoDuration).toFixed(2)) 
  : message;
  const showButtons = action !== 'rendering' && action !== 'uploading';
  return (
    <div className='fileIOPrompt'>
      <div className='fileIOPrompt__headline'>
        {headlineIcon} {headline}
      </div>
      <div>
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
