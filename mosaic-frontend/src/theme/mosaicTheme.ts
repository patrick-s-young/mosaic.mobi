import { createTheme } from '@material-ui/core/styles';


const orange = { light: '#ff1744', main: '#ff616f', dark: '#c4001d', contrastText: 'rgba(255, 255, 255, 0.87)'};
const purple = { light: '#ae52d4', main: '#7b1fa2', dark: '#4a0072', contrastText: 'rgba(255, 255, 255, 0.87)'};
const white = '#fbfbfd';
const black = '#1d1e20';

export const mosaicTheme = createTheme({
  overrides: {
    MuiTabs: {
      root: {
        backgroundColor: white
      },
      indicator: {
        backgroundColor: purple.dark
      }
    },
    MuiTab: {
      root: {
        '&$selected': {
          color: purple.main
        }
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: white,
        color: black
      }
    },
    MuiButton: {
      outlined: {
        borderColor: purple.dark,
      },
    },
    MuiTouchRipple: {
      child: { backgroundColor: purple.light }
    }
  },
  palette: {
    common: {
      black: '#1d1e20',
      white: '#fdfdfd'
    },
    primary: purple,
    secondary: orange
  }
});