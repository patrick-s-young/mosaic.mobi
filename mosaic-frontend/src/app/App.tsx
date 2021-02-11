import * as React from 'react';
import { useEffect, } from 'react';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// <App>
import { AppPhaseEnum, setCanvasWidth } from 'app/appSlice';
import type { AppState, DeviceProfile } from 'app/appSlice';
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


const App: React.FC = () => {
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);
  const { mosaicPhase } = useSelector<RootState, MosaicState>((state) => state.mosaic as MosaicState);
  const { appPhase, deviceProfiles, deviceIndex } = useSelector<RootState, AppState>((state) => state.app);

  const deviceProfile: DeviceProfile = deviceProfiles[deviceIndex];

  // initialize sreen resolution-dependent values
  useEffect(() => {
    //document.body.style.background = `url(${backgroundImage})`;
    const canvasWidth: number = deviceProfile.videoArea.width; //| undefined = document.getElementById('canvasWidth_reference')?.clientWidth;
    dispatch(setCanvasWidth({ canvasWidth }));
    dispatch(setScrubberCanvasWidth({ canvasWidth }));
  }, []);

  return (
    <div>
        <DevicePreview>
          <div className='video-area' style={ deviceProfile.videoArea } >
            { navPhase === NavPhaseEnum.UPLOAD &&
                <UploadVideo 
                  displaySize={deviceProfile.videoArea}
                />
            }
            { navPhase === NavPhaseEnum.DOWNLOAD && 
                <RenderMosaic 
                  displaySize={deviceProfile.videoArea}
                />
            } 
            { mosaicPhase !== MosaicPhaseEnum.WAITING_FOR_VIDEO &&
              <>
                <Scrubber />
                <MosaicTiles />
              </>
            }
          </div>
          
          <div className='scrubber-slider' style={ deviceProfile.scrubberSlider }>
            <ScrubberSlider 
              pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || navPhase !== NavPhaseEnum.EDIT}
            />
          </div>
          <div className='mosaic-selector' style={ deviceProfile.mosaicSelector }>
            <MosaicSelector 
              pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || navPhase !== NavPhaseEnum.EDIT}
            />
          </div>
          <div className='navigation' style={ deviceProfile.navigation }>
            <Navigation 
              pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
            />
          </div>
      </DevicePreview>
    </div>
  );
}

export default App;

