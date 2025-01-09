import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from '@store/store';
import App from '@/components/App/App';
import { ThemeProvider } from '@material-ui/core/styles';
import { mosaicTheme } from '@theme/mosaicTheme';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={mosaicTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>
)
