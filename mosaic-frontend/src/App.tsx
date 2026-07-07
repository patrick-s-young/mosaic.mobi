import ReactGA from 'react-ga4';
ReactGA.initialize('G-J0W4FDF6FY'); 
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AspectRatioToggle,
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
import { setCanvasWidth, setUiVisible } from './app.slice';
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
  const { appPhase, aspectRatio, uiVisible } = useSelector<RootState, AppState>((state) => state.app);
  const [isInAppBrowser, _ ] = useState(window.navigator.userAgent.indexOf('Instagram') > -1);
  const is9x16 = aspectRatio === '9x16';


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
          <div
            className={`app_stage ${is9x16 ? 'app_stage--9x16' : ''}`}
            style={is9x16 ? { width: appDimensions.popOver.width, height: appDimensions.popOver.height } : undefined}
          >
            <RenderMosaic
                displaySize={appDimensions.popOver}
                isActive={navPhase === NavPhaseEnum.DOWNLOAD}
            />
            <UploadVideo
                displaySize={appDimensions.popOver}
                isActive={navPhase === NavPhaseEnum.UPLOAD}
            />
            { navPhase === NavPhaseEnum.EDIT && <AspectRatioToggle /> }
            <div
              className={`video_area ${is9x16 ? 'video_area--9x16' : ''}`}
              style={is9x16 ? undefined : appDimensions.videoArea}
              onClick={is9x16 ? () => dispatch(setUiVisible({ uiVisible: !uiVisible })) : undefined}
            >
              { mosaicPhase !== MosaicPhaseEnum.WAITING_FOR_VIDEO &&
                <>
                  <Scrubber />
                  <MosaicTiles />
                </>
              }
            </div>
            <div
              className={`app_ui_container ${is9x16 ? 'app_ui_container--9x16' : ''} ${is9x16 && !uiVisible ? 'app_ui_container--hidden' : ''}`}
              style={is9x16 ? undefined : { height: appDimensions.uiContainerHeight }}
            >
              {/* debug tool: <MobileDisplayLog /> */}
              <ScrubberSlider width={appDimensions.scrubberSlider.width} />
              <MosaicSelector width={appDimensions.scrubberSlider.width} />
              <Navigation
                width={appDimensions.navigation.width}
                height={appDimensions.navigation.height}
                pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
              />
            </div>
          </div>
          }
        </AssignDisplay>
    </div>
  );
}

export default App;

