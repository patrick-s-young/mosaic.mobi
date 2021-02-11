import * as React from 'react';
import iPhone_XR from '../../assets/device-preview/iPhone_XR_mock_414x712.png';

export type DevicePreviewProps = {
  children: Array<React.ReactChild>
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ children }) => {
  return (
    <div style={{ padding: '2%', marginLeft: '300px'}}>
        <img src={iPhone_XR} style={{ position: 'absolute'}} id='device-png'/>
        <div style={{ position: 'absolute', marginTop: '132px', marginLeft: '35px'}}>
          {children}
        </div>
    </div>
  );
}

export default DevicePreview;
