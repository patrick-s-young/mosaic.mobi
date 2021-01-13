import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentScrubberFrame } from 'features/mosaicImage/scrubberSlice';
import type { CurrentScrubberFrame, ScrubberState } from 'features/mosaicImage/scrubberSlice';
import type { RootState } from 'app/rootReducer';
import 'features/mosaicImage/scrubberStyles.css';


const ScrubberSlider: React.FC = () => {
  const dispatch = useDispatch();
  const { currentScrubberFrame, scrubberFramesMax } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
  );
  const onSlideHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentScrubberFrame(parseInt(e.target.value) as CurrentScrubberFrame));
  };

  return (
    <div style={{ marginTop: '8px'}}>
      <input 
        type='range'
        min='0'
        max={scrubberFramesMax - 1} 
        step='1'
        defaultValue={currentScrubberFrame} 
        className='scrubberSlider' 
        onChange={onSlideHandler}
        data-testid='backgroundSelectorInput'
      />
    </div>
  );
}

export default ScrubberSlider;
