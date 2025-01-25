import { Mosaic2, Mosaic3, Mosaic4, Mosaic6, Mosaic9 } from './mosaicSelectorButton.icons';
import type { NumTiles } from '../MosaicTiles/mosaicTiles.slice';
import './mosaicSelectorButton.scss';


const MosaicIcons = {
  2: <Mosaic2 />,
  3: <Mosaic3 />,
  4: <Mosaic4 />,
  6: <Mosaic6 />,
  9: <Mosaic9 />
}

export interface MosaicSelectorButtonProps {
  numTiles: NumTiles;
  width: number;
  isSelected: boolean;
  onClick: (newNumTiles: NumTiles) => void;
}

const MosaicSelectorButton: React.FC<MosaicSelectorButtonProps> = ({ numTiles, width, isSelected = false, onClick }) => {
  const buttonClass = isSelected 
    ? 'mosaicSelectorButton mosaicSelectorButton--selected' 
    : 'mosaicSelectorButton';
    
  return (
    <button 
      className={buttonClass} 
      style={{ width, height: width }}
      onClick={() => onClick(numTiles)}
    >
      {MosaicIcons[numTiles]}
    </button>
  );
};  

export default MosaicSelectorButton;