import ReactGA from 'react-ga4';
ReactGA.initialize('G-J0W4FDF6FY'); 
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AssignDisplay, 
  InAppPrompt,
  MosaicSelector,
  MosaicTiles, 
  Navigation, 
  RenderMosaic, 
  Scrubber,
  ScrubberSlider,
  UploadVideo
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
  const [isInAppBrowser, _ ] = useState(window.navigator.userAgent.indexOf('Instagram') > -1);


  useEffect(() => {
    const canvasWidth: number = appDimensions.videoArea.width;
    dispatch(setCanvasWidth({ canvasWidth }));
    dispatch(setScrubberCanvasWidth({ canvasWidth }));
  }, []);

  return (
    <div>
        <AssignDisplay>
          { isInAppBrowser && <InAppPrompt /> }
          { !isInAppBrowser && 
          <>
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
            <div  className="app_ui_container"  style={{ height: appDimensions.uiContainerHeight }}>
              {/* debug tool: <MobileDisplayLog /> */}
              <ScrubberSlider width={appDimensions.scrubberSlider.width} />
              <MosaicSelector width={appDimensions.scrubberSlider.width} />
              <Navigation 
                width={appDimensions.navigation.width}
                height={appDimensions.navigation.height} 
                pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
              />
            </div>
          </>
          }
        </AssignDisplay>
    </div>
  );
}

export default App;

