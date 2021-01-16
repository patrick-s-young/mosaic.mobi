import * as React from 'react';
import { Navigation } from 'features/navigation'; 
import { UploadVideo } from 'features/uploadVideo/UploadVideo';
import { RenderMosaic } from 'features/renderMosaic/RenderMosaic';
import Scrubber from 'features/mosaicImage/Scrubber';
import ScrubberSlider from 'features/mosaicImage/scrubberSlider/ScrubberSlider';
import { MosaicTiles, MosaicSelector } from 'features/mosaicVideo';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
import type { NavState } from 'features/navigation/navSlice';
import 'app/app.css';

const App: React.FC = () => {
  const { navSection } = useSelector<RootState, NavState>((state) => state.nav);

  console.log(`window.innerWidth: ${window.innerWidth}`);

  console.log(`window.innerWidth: ${window.innerHeight}`);

  return (
    <div>

      <div className='app_main-screen_container'>
      { navSection === 'Upload Video' && 
          <UploadVideo />
      }
      { navSection === 'Edit Mosaic' && 
      <div>
          <Scrubber />
          <MosaicTiles />
      </div>
      }
      { navSection === 'Render Mosaic' && 
          <RenderMosaic />
      }
      </div>

      <div className='app_main-screen_margin-bottom'></div>
      <div className='app_scrubber-slider_container'>
        <ScrubberSlider />
      </div>
      <div className='app_mosaic-selector_container'>
        <MosaicSelector />
      </div>
      <div className='app_mosaic-selector_margin-bottom'></div>
      <div className='app_navigation_container'>
        <Navigation />
      </div>
    </div>
  );
}

export default App;

