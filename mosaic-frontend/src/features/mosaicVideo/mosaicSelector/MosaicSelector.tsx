import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/rootReducer';
import { setNumTiles } from 'features/mosaicVideo';
import type { MosaicState, NumTiles } from 'features/mosaicVideo';
import mosaicSelectroConfig from 'features/mosaicVideo/mosaicSelector/mosaicSelector.config';
import Button from 'components/Button';
import { v1 as uuid } from 'uuid';
import 'features/mosaicVideo/mosaicSelector/mosaicSelector.css'

export interface MosaicSelectorProps {
  pauseInput: boolean
}

export const MosaicSelector: React.FC<MosaicSelectorProps> = ({ pauseInput }) => {
  const dispatch = useDispatch();
  const { numTiles } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic as MosaicState
  );

  const onClickHandler = (newStateValue: NumTiles) => {
    if (!pauseInput) dispatch(setNumTiles(newStateValue));
  }

  return (
    <div className='mosaicSelector_flex-container'>
      { mosaicSelectroConfig().map((button) =>
          <Button 
            onClickCallback={onClickHandler}
            stateValue={button.stateValue}
            isEnabled={button.stateValue !== numTiles || pauseInput === true}
            imagePath={button.imagePath}
            className={button.className}
            altText={button.altText}
            key={uuid()}
          />)
      }
    </div>
  );
}




