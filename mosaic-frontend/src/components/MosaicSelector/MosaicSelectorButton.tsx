import React from 'react';
import { MosaicSelectorButtonProps } from '@interfaces/MosaicSelectorButtonProps';
import mosaicIcons from './mosaicSelectorButton.icons';
import './mosaicSelectorButton.scss';


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
      {React.createElement(mosaicIcons[numTiles])}
    </button>
  );
};  

export default MosaicSelectorButton;