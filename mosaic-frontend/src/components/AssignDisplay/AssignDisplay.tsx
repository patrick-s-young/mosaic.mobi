import * as React from 'react';
import isMobile from 'is-mobile';
import DeviceDisplay from './DeviceDisplay';
import DesktopDisplay from './DesktopDisplay';
import { AssignDisplayProps } from '@interfaces/AssignDisplayProps';

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