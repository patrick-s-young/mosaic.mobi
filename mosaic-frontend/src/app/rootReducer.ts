import { combineReducers } from '@reduxjs/toolkit';
import navSlice  from '@features/navigation/navSlice';
import uploadSlice from '@features/uploadVideo/uploadSlice';
import scrubberSlice from '@features/mosaicImage/scrubberSlice';
import mosaicSlice from '@features/mosaicVideo/mosaicSlice';
import appSlice from '@app/appSlice';
import renderSlice from '@features/renderMosaic/renderSlice';

const rootReducer = combineReducers({
  app: appSlice,
  nav: navSlice,
  upload: uploadSlice,
  scrubber: scrubberSlice,
  mosaic: mosaicSlice,
  render: renderSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;