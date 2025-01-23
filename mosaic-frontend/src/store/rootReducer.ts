import { combineReducers } from '@reduxjs/toolkit';
import navSlice  from '@/components/Navigation/navSlice';
import uploadSlice from '@/components/UploadVideo/uploadSlice';
import scrubberSlice from '@/components/Scrubber/scrubberSlice';
import mosaicSlice from '@/components/MosaicTiles/mosaicSlice';
import appSlice from '@/components/App/appSlice';
import renderSlice from '@/components/RenderMosaic/renderSlice';
import mobileDisplayLogSlice from '@devTools/MobileDisplayLog/mobileDisplayLog.slice';

const rootReducer = combineReducers({
  app: appSlice,
  mobileDisplayLog: mobileDisplayLogSlice,
  mosaic: mosaicSlice,
  nav: navSlice,
  render: renderSlice,
  scrubber: scrubberSlice,
  upload: uploadSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

