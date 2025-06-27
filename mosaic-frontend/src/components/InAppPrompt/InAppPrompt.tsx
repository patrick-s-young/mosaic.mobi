import instagramPrompt from '@/assets/instagram_prompt.jpg';
import { appDimensions } from '@/app.config';
import { InAppPromptProps } from '@interfaces/InAppPrompt';
import './inAppPrompt.scss';

const InAppPrompt: React.FC<InAppPromptProps> = () => {
  return (
    <div className="inAppPrompt" style={{ width: appDimensions.videoArea.width }}>
      <img className="inAppPrompt__img" src={instagramPrompt} />
    </div>
  );
};

export default InAppPrompt;
