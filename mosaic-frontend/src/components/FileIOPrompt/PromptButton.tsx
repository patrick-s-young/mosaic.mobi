import { PromptButtonProps } from '@interfaces/PromptButtonProps';
import './promptButton.scss';


const PromptButton = ({ prompt, onClick, primary = false }: PromptButtonProps) => {
  return (
    <button className={primary ? 'promptButton promptButton--primary' : 'promptButton'} onClick={onClick}>{prompt}</button>
  );
};

export default PromptButton;
