import { combineReducers } from '@reduxjs/toolkit';
import navSlice  from '@components/Navigation/nav.slice';
import uploadSlice from '@components/UploadVideo/upload.slice';
import scrubberSlice from '@components/Scrubber/scrubber.slice';
import mosaicSlice from '@components/MosaicTiles/mosaicTiles.slice';
import appSlice from '@components/App/app.slice';
import renderSlice from '@components/RenderMosaic/renderMosaic.slice';
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

