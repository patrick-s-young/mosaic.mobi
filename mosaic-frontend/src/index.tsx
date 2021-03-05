import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'app/store';
import App from 'app/App';
import { ThemeProvider } from '@material-ui/core/styles';
import { mosaicTheme } from './theme/mosaicTheme';



ReactDOM.render(
  <ThemeProvider theme={mosaicTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);
