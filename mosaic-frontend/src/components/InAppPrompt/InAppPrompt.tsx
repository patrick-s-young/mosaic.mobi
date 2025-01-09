
import './inAppPrompt.scss';
import instagramPrompt from '@/assets/instagram_prompt.jpg';
import { appDimensions } from '@/components/App/app.config';

const InAppPrompt: React.FC = () => {
  return (
    <div className="inAppPrompt" style={{ width: appDimensions.videoArea.width }}>
      <img className="inAppPrompt__img" src={instagramPrompt} />
    </div>
  );
};

export default InAppPrompt;
