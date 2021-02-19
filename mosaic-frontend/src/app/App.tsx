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
          <RenderMosaic 
              displaySize={deviceProfile.popOver}
              isActive={navPhase === NavPhaseEnum.DOWNLOAD}
          />
          <UploadVideo 
              displaySize={deviceProfile.popOver}
              isActive={navPhase === NavPhaseEnum.UPLOAD}
          />
          
          <div className='video-area' style={ deviceProfile.videoArea } >
            { mosaicPhase !== MosaicPhaseEnum.WAITING_FOR_VIDEO &&
              <>
                <Scrubber />
                <MosaicTiles />
              </>
            }
          </div>
          
          <ScrubberSlider 
            width={deviceProfile.scrubberSlider.width}
            height={deviceProfile.scrubberSlider.height} 
          />

 
          <MosaicSelector 
            width={deviceProfile.scrubberSlider.width}
            height={deviceProfile.scrubberSlider.height} 
          />


          <Navigation 
            width={deviceProfile.navigation.width}
            height={deviceProfile.navigation.height} 
            pauseInput={appPhase === AppPhaseEnum.INIT_SESSION || appPhase === AppPhaseEnum.LOADING}
          />
      </DevicePreview>
    </div>
  );
}

export default App;

