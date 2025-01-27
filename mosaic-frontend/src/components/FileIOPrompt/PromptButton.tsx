import { PromptButtonProps } from '@interfaces/PromptButtonProps';
import './promptButton.scss';


const PromptButton = ({ prompt, onClick }: PromptButtonProps) => {
  return (
    <button className="promptButton" onClick={onClick}>{prompt}</button>
  );
};

export default PromptButton;
