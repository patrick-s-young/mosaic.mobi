
import { traceEvent } from '@analytics/traceEvent';
import instagramPrompt from '@/assets/instagram_prompt.jpg';
import { appDimensions } from '@/components/App/app.config';
import './inAppPrompt.scss';

const InAppPrompt: React.FC = () => {
  traceEvent({
    category: 'InAppPrompt',
    action: 'INSTAGRAM_BIO_CLICK',
    label: 'N/A'
  });
  return (
    <div className="inAppPrompt" style={{ width: appDimensions.videoArea.width }}>
      <img className="inAppPrompt__img" src={instagramPrompt} />
    </div>
  );
};

export default InAppPrompt;
