import isMobile from 'is-mobile';

const [width, uiContainerHeight] = isMobile({ tablet: true }) 
  ? [window.innerWidth, window.innerHeight - window.innerWidth] 
  : [414, 302];

const popOverHeight = width + uiContainerHeight;

const MAX_VIDEO_UPLOAD_DURATION = 15;
const SCRUBBER_FRAMES_MAX = 20
const DEFAULT_VIDEO_NUM_TILES = 4;

const appDimensions = {
  popOver: { width, height: popOverHeight },
  videoArea: { width, height: width },
  scrubberSlider: { width, height: 90 },
  mosaicSelector: { width, height: 72 },
  navigation: { width, height: 120 },
  uiContainerHeight
}

const popOverProps = {
  width: `${appDimensions.popOver.width}px`,
  height: `${appDimensions.popOver.height}px`,
  showTop: `0px`,
  hideTop: `${appDimensions.popOver.height}px`
}

const slideInOutProps = {
  enter: `${0.2 * appDimensions.popOver.height}px`,
  exit: `${appDimensions.popOver.height}px`
}


const defaultVideoConfig = {
  assetID: '330055' as string,
  uploadDuration: 4.5 as number,
  numTiles: 3
}

const mosaicTileConfig = {
  ANIMATION_CYCLE_DURATION: 15000,
  FADE_DURATION: 500,
  FULL_OPACTIY_DURATION: 1000
}

export { 
  appDimensions, 
  MAX_VIDEO_UPLOAD_DURATION,
  SCRUBBER_FRAMES_MAX,
  DEFAULT_VIDEO_NUM_TILES,
  defaultVideoConfig,
  popOverProps,
  slideInOutProps,
  mosaicTileConfig
};
