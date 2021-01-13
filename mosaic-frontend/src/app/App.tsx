import * as React from 'react';
import { Navigation } from 'features/navigation'; 
import { UploadVideo } from 'features/uploadVideo/UploadVideo';
import { RenderMosaic } from 'features/renderMosaic/RenderMosaic';
import Scrubber from 'features/mosaicImage/Scrubber';
import ScrubberSlider from 'features/mosaicImage/ScrubberSlider';
import { MosaicTiles, MosaicSelector } from 'features/mosaicVideo';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
import type { NavState } from 'features/navigation/navSlice';
import 'app/app.css';
import 'app/iphone-x.css';



const App: React.FC = () => {
  const { navSection } = useSelector<RootState, NavState>((state) => state.nav);

  console.log(`window.innerWidth: ${window.innerWidth}`);

  console.log(`window.innerWidth: ${window.innerHeight}`);

  return (
    <div className="iphone-x-container">

      <div className='iphone-x-main-screen'>
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

      <div className='iphone-x-main-screen-to-slider-spacing'></div>
      <div className='iphone-x-slider'>
        <ScrubberSlider />
      </div>
      <div className='iphone-x-filter-buttons-container'>
        <MosaicSelector />
      </div>
      <div className='iphone-x-buttons-to-navigation-spacing'></div>
      <div className='iphone-x-navigation-container'>
        <Navigation />
      </div>
    </div>
  );
}

export default App;

