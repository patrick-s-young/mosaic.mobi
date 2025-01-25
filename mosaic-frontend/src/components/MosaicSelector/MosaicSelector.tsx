import { traceEvent } from '@analytics/traceEvent';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/rootReducer';
import { setNumTiles } from '@components/MosaicTiles';
import type { MosaicState, NumTiles } from '@components/MosaicTiles';
import MosaicSelectorButton from '@components/MosaicSelector/MosaicSelectorButton';
import './mosaicSelector.scss';

const numTileValues: NumTiles[] = [2, 3, 4, 6, 9];

export interface MosaicSelectorProps {
  width: number
}

const MosaicSelector: React.FC<MosaicSelectorProps> = ({ width }) => {
  const dispatch = useDispatch();
  const buttonWidth = width / 5;
  const { numTiles } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic as MosaicState
  );

  const handleOnClick = (newNumTiles: NumTiles) => {
    traceEvent({
      category: 'Mosaic Selector',
      action: 'NUM_TILES CHANGE',
      label: newNumTiles.toString()
    });
    dispatch(setNumTiles(newNumTiles));
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