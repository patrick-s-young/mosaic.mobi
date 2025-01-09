import isMobile from 'is-mobile';


const [width, uiContainerHeight] = isMobile({ tablet: true }) 
  ? [window.innerWidth, window.innerHeight - window.innerWidth] 
  : [414, 302];

const popOverHeight = width + uiContainerHeight;

export const appDimensions = {
  popOver: { width, height: popOverHeight },
  videoArea: { width, height: width },
  scrubberSlider: { width, height: 90 },
  mosaicSelector: { width, height: 72 },
  navigation: { width, height: 120 },
  uiContainerHeight
}
