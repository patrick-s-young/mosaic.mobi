import * as React from 'react';
import { useEffect, } from 'react';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// <App>
import { AppPhaseEnum, setCanvasWidth } from 'app/appSlice';
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
import { setScrubberCanvasWidth } from 'features/mosaicImage/scrubberSlice';
// <MosaicSelector>
import { MosaicSelector } from 'features/mosaicVideo';
// <RenderMosaic>
import { RenderMosaic } from 'features/renderMosaic/RenderMosaic';
// <DevicePreview>
import DevicePreview from '../devTools/devicePreview/DevicePreview';
import { appDimensions } from 'app/app.config';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);
  const { mosaicPhase } = useSelector<RootState, MosaicState>((state) => state.mosaic as MosaicState);
  const { appPhase } = useSelector<RootState, AppState>((state) => state.app);

  // initialize sreen resolution-dependent values
  useEffect(() => {
    const canvasWidth: number = appDimensions.videoArea.width; //| undefined = document.getElementById('canvasWidth_reference')?.clientWidth;
    dispatch(setCanvasWidth({ canvasWidth }));
    dispatch(setScrubberCanvasWidth({ canvasWidth }));
  }, []);

  return (
    <div>
        <DevicePreview>
          <RenderMosaic 
              displaySize={appDimensions.popOver}
              isActive={navPhase === NavPhaseEnum.DOWNLOAD}
          />
          <UploadVideo 
              displaySize={appDimensions.popOver}
              isActive={navPhase === NavPhaseEnum.UPLOAD}
          />
          
          <div style={ appDimensions.videoArea } >
            { mosaicPhase !== MosaicPhaseEnum.WAITING_FOR_VIDEO &&
              <>
                <Scrubber />
                <MosaicTiles />
              </>
            }
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            boxSizing: 'border-box', 
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            height: appDimensions.uiContainerHeight,
            padding: '20px 0 20px 0',
            gap: '20px'
            }}>
            <ScrubberSlider 
              width={appDimensions.scrubberSlider.width}
              height={appDimensions.scrubberSlider.height} 
            />
            <MosaicSelector 
              width={appDimensions.scrubberSlider.width}
              height={appDimensions.scrubberSlider.height} 
            />
            <Navigation 
              width={appDimensions.navigation.width}
              height={appDimensions.navigation.height} 
              pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
            />
          </div>

        </DevicePreview>
    </div>
  );
}

export default App;

