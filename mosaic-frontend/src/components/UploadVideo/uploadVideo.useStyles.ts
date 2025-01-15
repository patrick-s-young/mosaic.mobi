import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    container: {
      position: 'absolute',
      backgroundColor: theme.palette.common.white, 
      marginTop: '0px',
      opacity: 0.98,
      zIndex: 20
    },
    centerScreen: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    input: {
      display: 'none',
    },
    alertHeadline: {
      color: theme.palette.secondary.dark,
    },
    promptHeadline: {
      color: theme.palette.primary.dark,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.typography.h5
    },
    promptBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& > *': {
        padding: theme.spacing(1)
      },
      margin: theme.spacing(4),
      padding: theme.spacing(1),
      border: '1px solid #d0d0d0'
    },
    promptButtonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-evenly',
    }
  })
);

