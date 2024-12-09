import * as React from 'react';
import isMobile from 'is-mobile';
import DeviceDisplay from './DeviceDisplay';
import DesktopDisplay from './DesktopDisplay';

export type AssignDisplayProps = {
  children: React.ReactNode
}

const AssignDisplay: React.FC<AssignDisplayProps> = ({ children }) => {
  const _isMobile = isMobile({ tablet: true});

  return (
    <div>
      { !_isMobile && 
        <DesktopDisplay>
          {children}
        </DesktopDisplay>
      }

      { _isMobile &&
        <DeviceDisplay>
          {children}
        </DeviceDisplay>
      }
    </div>
  );
}

export default AssignDisplay;
// 