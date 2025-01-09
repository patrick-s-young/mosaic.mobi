import ReactGA from 'react-ga4';
ReactGA.initialize('G-J0W4FDF6FY'); 
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Navigation, 
  AssignDisplay, 
  UploadVideo, 
  RenderMosaic, 
  MosaicTiles, 
  MosaicSelector,
  Scrubber,
  ScrubberSlider
} from '@/components'; 

import type { RootState } from '@store/rootReducer';
import type { NavState } from '@/components/Navigation/navSlice';
import type { MosaicState } from '@/components/MosaicTiles';
import type { AppState } from '@/components/App/appSlice';
import { setScrubberCanvasWidth } from '@components/Scrubber/scrubberSlice';
import { NavPhaseEnum } from '@/components/Navigation/navSlice';
import { MosaicPhaseEnum } from '@/components/MosaicTiles';
import { AppPhaseEnum, setCanvasWidth } from '@/components/App/appSlice';
import { appDimensions } from '@/components/App/app.config';
import '@/components/App/app.css';

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
        <AssignDisplay>
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
            {/* <MobileDisplayLog /> */}
            <ScrubberSlider 
              width={appDimensions.scrubberSlider.width}
            />
            <MosaicSelector 
              width={appDimensions.scrubberSlider.width}
            />
            <Navigation 
              width={appDimensions.navigation.width}
              height={appDimensions.navigation.height} 
              pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
            />
          </div>

        </AssignDisplay>
    </div>
  );
}

export default App;

