import isMobile from 'is-mobile';

const [width, uiContainerHeight] = isMobile({ tablet: true }) 
  ? [window.innerWidth, window.innerHeight - window.innerWidth] 
  : [414, 302];

const popOverHeight = width + uiContainerHeight;

const appDimensions = {
  popOver: { width, height: popOverHeight },
  videoArea: { width, height: width },
  scrubberSlider: { width, height: 90 },
  mosaicSelector: { width, height: 72 },
  navigation: { width, height: 120 },
  uiContainerHeight
}

const MAX_VIDEO_UPLOAD_DURATION = 15;
const SCRUBBER_FRAMES_MAX = 20

const defaultVideoConfig = {
  assetID: '330055' as string,
  uploadDuration: 4.5 as number,
  numTiles: 3
}

export { 
  appDimensions, 
  MAX_VIDEO_UPLOAD_DURATION,
  SCRUBBER_FRAMES_MAX,
  defaultVideoConfig
};
