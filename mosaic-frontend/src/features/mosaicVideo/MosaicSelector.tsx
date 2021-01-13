import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/rootReducer';
import { setNumTiles } from 'features/mosaicVideo';
import type { MosaicState, NumTiles } from 'features/mosaicVideo';
import { getMosaicSelectorConfig } from 'features/mosaicVideo/helpers';
import Button from 'components/Button';
import { v1 as uuid } from 'uuid';
import 'features/mosaicVideo/mosaicStyles.css';

export const MosaicSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { numTiles } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic  as MosaicState
  );

  const onClickHandler = (newStateValue: NumTiles) => {
     dispatch(setNumTiles(newStateValue));
  }

  return (
    <div className='mosaicSelector-container'>
      { getMosaicSelectorConfig().map((button) =>
          <Button 
            onClickCallback={onClickHandler}
            stateValue={button.stateValue}
            isEnabled={button.stateValue !== numTiles}
            imagePath={button.imagePath}
            className={button.className}
            altText={button.altText}
            key={uuid()}
          />)
      }
    </div>
  );
}




