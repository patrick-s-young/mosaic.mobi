import ReactGA from 'react-ga4';
ReactGA.initialize('G-J0W4FDF6FY'); 
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
// slices
import { setScrubberCanvasWidth } from '@/components/Scrubber/scrubber.slice';
import { setCanvasWidth } from './app.slice';
import { appDimensions } from './app.config';
// interfaces
import { AppState } from '@interfaces/AppState';
import { NavState } from '@interfaces/NavState';
import { MosaicState } from '@interfaces/MosaicState';
// types
import type { RootState } from '@typescript/types';
// enums
import { NavPhaseEnum, MosaicPhaseEnum, AppPhaseEnum } from '@typescript/enums';
import './app.css';


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

