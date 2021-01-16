import type { ButtonConfig } from 'components/button.config';
import { numTilesAllPossibleValues } from 'features/mosaicVideo/mosaicSlice';
import mosaicSelectorImage02 from 'assets/images/02_mosaic_selector_64x64_on.png';
import mosaicSelectorImage03 from 'assets/images/03_mosaic_selector_64x64_on.png';
import mosaicSelectorImage04 from 'assets/images/04_mosaic_selector_64x64_on.png';
import mosaicSelectorImage06 from 'assets/images/06_mosaic_selector_64x64_on.png';
import mosaicSelectorImage09 from 'assets/images/09_mosaic_selector_64x64_on.png';

interface GetMosaicSelectorConfig {
  (): Array<ButtonConfig>
}

// instead of function store value in const
export const getMosaicSelectorConfig: GetMosaicSelectorConfig = () => {
  const imageModules: {[index: string]:any} = {
    im2: mosaicSelectorImage02, 
    im3: mosaicSelectorImage03, 
    im4: mosaicSelectorImage04, 
    im6: mosaicSelectorImage06, 
    im9: mosaicSelectorImage09
  }

  return numTilesAllPossibleValues.map(numTiles => {

    return {
      stateValue: numTiles,
      imagePath: imageModules[`im${numTiles}`],
      className: {
        default: 'mosaicSelector-button-default',
        hilite: 'mosaicSelector-button-hilite' 
      },
      altText: `Click for ${numTiles}-tile video mosaic`
    }
  });
}
