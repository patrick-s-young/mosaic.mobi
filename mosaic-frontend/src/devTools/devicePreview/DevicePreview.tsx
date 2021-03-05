import * as React from 'react';
import iPhone_XR from '../../assets/device-preview/iPhone_XR_mock_414x712.png';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    appContainer: {
      backgroundColor: theme.palette.common.white
    },
  })
);

export type DevicePreviewProps = {
  children: Array<React.ReactChild>
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <div style={{ padding: '2%', marginLeft: '200px'}}>
        <img src={iPhone_XR} style={{ position: 'absolute'}} id='device-png'/>
        <div style={{ position: 'absolute', marginTop: '132px', marginLeft: '35px'}} className={classes.appContainer}>
          {children}
        </div>
    </div>
  );
}

export default DevicePreview;
