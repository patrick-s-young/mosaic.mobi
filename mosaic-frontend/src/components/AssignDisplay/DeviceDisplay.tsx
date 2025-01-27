import { DeviceDisplayProps } from '@interfaces/DeviceDisplayProps';
import './deviceDisplay.scss';


const DeviceDisplay: React.FC<DeviceDisplayProps> = ({ children }) => {
  return <div className='deviceDisplay'>{children}</div>;
};

export default DeviceDisplay;

