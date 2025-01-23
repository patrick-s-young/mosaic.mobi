import './promptButton.scss';

interface PromptButtonProps {
  prompt: string;
  onClick?: () => void;
}

const PromptButton = ({ prompt, onClick }: PromptButtonProps) => {
  return (
    <button className="promptButton" onClick={onClick}>{prompt}</button>
  );
};

export default PromptButton;
