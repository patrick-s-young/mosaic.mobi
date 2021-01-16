import { ButtonProps } from '../../../components/Button';
import mosaicSelectorImage02 from '../../../assets/images/02_mosaic_selector_64x64_on.png';
import mosaicSelectorImage03 from '../../../assets/images/03_mosaic_selector_64x64_on.png';
import mosaicSelectorImage04 from '../../../assets/images/04_mosaic_selector_64x64_on.png';
import mosaicSelectorImage06 from '../../../assets/images/06_mosaic_selector_64x64_on.png';
import mosaicSelectorImage09 from '../../../assets/images/09_mosaic_selector_64x64_on.png';

type MosaicSelectorState =  2 | 3 | 4 | 6 | 9; 

// instead of function store value in const
function mosaicSelectorConfig (): ButtonProps<MosaicSelectorState>[] {
  const numTilesValues: Array<MosaicSelectorState> = [2, 3, 4, 6, 9];
  const imageModules: {[index: string]:any} = {
    im2: mosaicSelectorImage02, 
    im3: mosaicSelectorImage03, 
    im4: mosaicSelectorImage04, 
    im6: mosaicSelectorImage06, 
    im9: mosaicSelectorImage09
  }

  return numTilesValues.map(numTiles => {

    return {
      stateValue: numTiles,
      onClickCallback: (newStateValue: MosaicSelectorState) => 1,
      isEnabled: false,
      className: {
        default: 'mosaicSelector_button_default',
        hilite: 'mosaicSelector_button_hilite' 
      },
      imagePath: imageModules[`im${numTiles}`],
      altText: `Click for ${numTiles}-tile video mosaic`
    }
  });
}

export default mosaicSelectorConfig;