import { traceEvent } from '@analytics/traceEvent';
import { DeviceDisplayProps } from '@interfaces/DeviceDisplayProps';
import './deviceDisplay.scss';

const DeviceDisplay: React.FC<DeviceDisplayProps> = ({ children }) => {
  traceEvent({
    category: 'DeviceDisplay',
    action: 'onDeviceDisplay',
    label: 'N/A'
  });
  return <div className='deviceDisplay'>{children}</div>;
};

export default DeviceDisplay;

