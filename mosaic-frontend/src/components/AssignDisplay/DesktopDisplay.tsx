import { useEffect } from 'react';
import { traceEvent } from '@analytics/traceEvent';
import iPhone_XR from '@assets/device-preview/iPhone_XR_mock_414x712.png';
import { DesktopDisplayProps } from '@interfaces/DesktopDisplayProps';
import './desktopDisplay.scss';

const DesktopDisplay: React.FC<DesktopDisplayProps> = ({ children }) => {
  useEffect(() => {
    traceEvent({
      category: 'DesktopDisplay',
      action: 'onDesktopDisplay',
      label: 'N/A'
    });
  }, []);
  
  return (
    <div className='desktopDisplay'>
      <div className='desktopDisplay__leftColumn'>
        <span className='desktopDisplay__title'>Mosaic</span>
        <span className='desktopDisplay__tag desktopDisplay__tag--bold'>Awesome Video Edits</span>
        <span className='desktopDisplay__tag'>No Download Required</span>
      </div>
         
      <div className='desktopDisplay__middleColumn'>
        <img src={iPhone_XR} style={{ position: 'absolute'}} id='device-png'/>
        <div className='desktopDisplay__appContainer'>
          {children}
        </div>
      </div>

       <div className='desktopDisplay__rightColumn'>
        <div><a href='https://www.instagram.com/mosaic_video_app/' target='_blank'>Instagram</a></div>
        <div><a href='https://www.linkedin.com/in/patrick-s-young/' target='_blank'>LinkedIn</a></div>
        <div><a href='https://github.com/patrick-s-young/mosaic.mobi' target='_blank'>GitHub</a></div>
      </div>
    </div>
  );
};

export default DesktopDisplay;
