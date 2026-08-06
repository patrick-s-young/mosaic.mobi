import { useEffect } from 'react';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { DeviceDisplayProps } from '@interfaces/DeviceDisplayProps';
import './deviceDisplay.scss';

const DeviceDisplay: React.FC<DeviceDisplayProps> = ({ children }) => {
  useEffect(() => {
    logEvent(AnalyticsEvent.VIEW_MOBILE);
  }, []);
  
  return <div className='deviceDisplay'>{children}</div>;
};

export default DeviceDisplay;

