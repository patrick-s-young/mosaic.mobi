import isMobile from 'is-mobile';

const [width, uiContainerHeight] = isMobile({ tablet: true }) 
  ? [window.innerWidth, window.innerHeight - window.innerWidth] 
  : [414, 302];

export const appDimensions = {
  popOver: { width, height: 580 },
  videoArea: { width, height: width },
  scrubberSlider: { width, height: 90 },
  mosaicSelector: { width, height: 72 },
  navigation: { width, height: 120 },
  uiContainerHeight
}
