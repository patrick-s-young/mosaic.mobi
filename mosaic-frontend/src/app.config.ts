import isMobile from 'is-mobile';

const isMobileDevice = isMobile({ tablet: true });

const [width, uiContainerHeight] = isMobileDevice
  ? [window.innerWidth, window.innerHeight - window.innerWidth]
  : [414, 302];

const popOverHeight = width + uiContainerHeight;

const MAX_VIDEO_UPLOAD_DURATION = 15;
const SCRUBBER_FRAMES_MAX = 20
const DEFAULT_VIDEO_NUM_TILES = 4;

// height multiplier applied to the (square) canvas width for each aspect ratio
const ASPECT_HEIGHT_MULTIPLIER: { [key: string]: number } = { '1x1': 1, '9x16': 16 / 9 };
const getAspectHeight = (width: number, aspectRatio: string): number => {
  const raw = Math.round(width * (ASPECT_HEIGHT_MULTIPLIER[aspectRatio] ?? 1));
  // The 9:16 preview/render sources are H.264 (even dimensions, e.g. 320x568),
  // so the height must be rounded to an even number. Otherwise the odd value
  // (e.g. 569) makes each tile's canvas copy region 1px taller than the source
  // video; iOS/WebKit throws on a drawImage source rect that exceeds the video,
  // which kills the preview animation. 1:1 is square, so leave it exact.
  return aspectRatio === '9x16' ? raw - (raw % 2) : raw;
};

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
  isMobileDevice,
  MAX_VIDEO_UPLOAD_DURATION,
  SCRUBBER_FRAMES_MAX,
  DEFAULT_VIDEO_NUM_TILES,
  defaultVideoConfig,
  popOverProps,
  slideInOutProps,
  mosaicTileConfig,
  getAspectHeight
};
