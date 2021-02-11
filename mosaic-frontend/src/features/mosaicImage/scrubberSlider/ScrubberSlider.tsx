import * as React from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// scrubberSlice
import { setCurrentScrubberFrame } from 'features/mosaicImage/scrubberSlice';
import type { CurrentScrubberFrame, ScrubberState } from 'features/mosaicImage/scrubberSlice';
// styling
import 'features/mosaicImage/scrubberSlider/scrubberSlider.css';

export interface ScrubberSliderProps {
  pauseInput: boolean
}

const ScrubberSlider: React.FC<ScrubberSliderProps> = ({ pauseInput }) => {
  const dispatch = useDispatch();
  const { currentScrubberFrame, scrubberFramesMax } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
  );
  const onSlideHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempValue = parseInt(e.target.value) as CurrentScrubberFrame;
    console.log(`onSlideHander -> tempValue: ${tempValue}`)
    dispatch(setCurrentScrubberFrame(parseInt(e.target.value) as CurrentScrubberFrame));
  };

  console.log(`pauseInput: ${pauseInput}\nscrubberFramesMax: ${scrubberFramesMax}`);
  return (
    <div className='scrubberSlider_container'>
      <input 
        disabled={pauseInput}
        type='range'
        min='0'
        max={scrubberFramesMax - 1} 
        step='1'
        defaultValue={currentScrubberFrame} 
        className={pauseInput ? 'scrubberSlider_disabled' : 'scrubberSlider'} 
        onChange={onSlideHandler}
      />
    </div>
  );
}

export default ScrubberSlider;
