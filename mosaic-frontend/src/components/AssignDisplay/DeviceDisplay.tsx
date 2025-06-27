import { useEffect } from 'react';
import { traceEvent } from '@analytics/traceEvent';
import { DeviceDisplayProps } from '@interfaces/DeviceDisplayProps';
import './deviceDisplay.scss';

const DeviceDisplay: React.FC<DeviceDisplayProps> = ({ children }) => {
  useEffect(() => {
    traceEvent({
      category: 'DeviceDisplay',
      action: 'onDeviceDisplay',
      label: 'N/A'
    });
  }, []);
  
  return <div className='deviceDisplay'>{children}</div>;
};

export default DeviceDisplay;

