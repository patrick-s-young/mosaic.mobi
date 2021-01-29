import * as React from 'react';
// Redux Toolkit
import { useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// <App>
import { setAppPhase, AppPhaseEnum } from 'app/appSlice';
import type { AppState } from 'app/appSlice';
import 'app/app.css';
// <Navigation>
import { Navigation } from 'features/navigation'; 
import { NavPhaseEnum } from 'features/navigation/navSlice';
import type { NavState } from 'features/navigation/navSlice';
// <UploadVideo>
import { UploadVideo } from 'features/uploadVideo/UploadVideo';
// <MosaicTiles>
import type { MosaicState } from 'features/mosaicVideo';
import { MosaicPhaseEnum } from 'features/mosaicVideo';
import { MosaicTiles } from 'features/mosaicVideo';
// <Scrubber>
import Scrubber from 'features/mosaicImage/Scrubber';
// <ScrubberSlider>
import ScrubberSlider from 'features/mosaicImage/scrubberSlider/ScrubberSlider';
// <MosaicSelector>
import { MosaicSelector } from 'features/mosaicVideo';
// <RenderMosaic>
import { RenderMosaic } from 'features/renderMosaic/RenderMosaic';


const App: React.FC = () => {
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);
  const { mosaicPhase } = useSelector<RootState, MosaicState>((state) => state.mosaic as MosaicState);
  const { appPhase } = useSelector<RootState, AppState>((state) => state.app);
  return (
    <div>

      <div className='app_main-screen_container'>
      { navPhase === NavPhaseEnum.UPLOAD &&
          <UploadVideo />
      }
      { navPhase === NavPhaseEnum.DOWNLOAD && 
          <RenderMosaic />
      } 
      { mosaicPhase !== MosaicPhaseEnum.WAITING_FOR_VIDEO &&
        <>
          <Scrubber />
          <MosaicTiles />
        </>
      }
      </div>

      <div className='app_main-screen_margin-bottom'></div>
      <div className='app_scrubber-slider_container'>
        <ScrubberSlider 
          pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || navPhase !== NavPhaseEnum.EDIT}
        />
      </div>
      <div className='app_mosaic-selector_container'>
        <MosaicSelector 
          pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || navPhase !== NavPhaseEnum.EDIT}
        />
      </div>
      <div className='app_mosaic-selector_margin-bottom'></div>
      <div className='app_navigation_container'>
        <Navigation 
          pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
        />
      </div>
    </div>
  );
}

export default App;

