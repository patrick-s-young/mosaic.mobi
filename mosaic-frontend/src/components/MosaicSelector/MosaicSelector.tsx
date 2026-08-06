import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { setNumTiles } from '@components/MosaicTiles';
import MosaicSelectorButton from '@components/MosaicSelector/MosaicSelectorButton';
// types
import type { NumTiles, RootState } from '@typescript/types';
// interfaces
import { MosaicSelectorProps } from '@interfaces/MosaicSelectorProps';
import { MosaicState } from '@interfaces/MosaicState';
import './mosaicSelector.scss';

const numTileValues: NumTiles[] = [2, 3, 4, 6, 9];

const MosaicSelector: React.FC<MosaicSelectorProps> = ({ width }) => {
  const dispatch = useDispatch();
  const buttonWidth = width / 5;
  const { numTiles } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic as MosaicState
  );

  const handleOnClick = (newNumTiles: NumTiles) => {
    dispatch(setNumTiles(newNumTiles));
    logEvent(AnalyticsEvent.SELECT_TILE_COUNT, { num_tiles: newNumTiles });
  };

  return (
    <div className='mosaicSelector' style={{ width }}>
      {numTileValues.map((tileValue) => (
        <MosaicSelectorButton 
          numTiles={tileValue} 
          width={buttonWidth} 
          key={tileValue}
          isSelected={numTiles === tileValue}
          onClick={handleOnClick}
        />
      ))}
  </div>
  );
}


export default MosaicSelector;