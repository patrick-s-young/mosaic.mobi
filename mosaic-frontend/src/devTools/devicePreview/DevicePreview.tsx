import * as React from 'react';
import iPhone_XR from '../../assets/device-preview/iPhone_XR_mock_414x712.png';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const isMobile = require('is-mobile');

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 1,
    },
    gridLeft: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    appContainer: {
      backgroundColor: theme.palette.common.white
    },
    headline: {
      color: theme.palette.primary.dark,
      ...theme.typography.h3
    },
    paper: {
      textAlign: 'left',
      color: '#555',
      backgroundColor: '#ddd',
      margin: theme.spacing(2),
      padding: theme.spacing(1),
      ...theme.typography.h6
    },
    mobileMessage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      margin: theme.spacing(2),
      textAlign: 'center'
    }
  })
);

export type DevicePreviewProps = {
  children: Array<React.ReactChild>
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ children }) => {
  const classes = useStyles();


  return (
    <div>

      { isMobile() === false && 
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item xs={4} className={classes.gridLeft}>

                <div className={classes.headline}>mosaic.mobi</div>
                <div>coming soon to a phone near you.</div>

            </Grid>
            <Grid item xs={8}>
                    <img src={iPhone_XR} style={{ position: 'absolute'}} id='device-png'/>
                    <div style={{ position: 'absolute', marginTop: '132px', marginLeft: '35px'}} className={classes.appContainer}>
                      {children}
                    </div>
            </Grid>
          </Grid>
        </div>
      }

      { isMobile() && 

        <div className={classes.mobileMessage}>
            <div className={classes.headline}>mosaic.mobi</div>
            <div >coming soon to a phone near you.</div>
            <div style={{ lineHeight: '1.6'}}>-</div>
            <div >for a preview, view mosiac.mobi in a desktop browswer.</div>
        </div>
      }

    </div>
  );
}

export default DevicePreview;
