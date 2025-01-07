import './deviceDisplay.scss';
export type DeviceDisplayProps = {
  children: React.ReactNode
}

const DeviceDisplay: React.FC<DeviceDisplayProps> = ({ children }) => {
  return <div className='deviceDisplay'>{children}</div>;
};

export default DeviceDisplay;

