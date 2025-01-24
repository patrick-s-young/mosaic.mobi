
import { traceEvent } from '@analytics/traceEvent';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store/rootReducer';
import { setCurrentScrubberFrame } from '@/components/Scrubber/scrubber.slice';
import type { CurrentScrubberFrame, ScrubberState } from '@/components/Scrubber/scrubber.slice';
import { Slider } from '@material-ui/core';
import './scrubberSlider.scss';


export interface ScrubberSliderProps {
  width: number
}

const ScrubberSlider: React.FC<ScrubberSliderProps> = ({ width }) => {

  const dispatch = useDispatch();
  const { currentScrubberFrame, scrubberFramesMax } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
  );

  const handleChange = (_: any, newValue: number | number[]) => {
  traceEvent({
    category: 'ScrubberSlider',
    action: 'SCRUBBER_FRAME_UPDATED',
    label: 'Instagram'
  });
    dispatch(setCurrentScrubberFrame(newValue as CurrentScrubberFrame));
  };

  function valuetext(value: number) {
    return `frame ${value}`;
  }

  return (
    <div style={{ width }}>
      <div className='scrubberSlider'>
        <Slider
          value={currentScrubberFrame}
          getAriaValueText={valuetext}
          onChange={handleChange}
          defaultValue={currentScrubberFrame}
          aria-labelledby="discrete-slider-small-steps"
          step={1}
          marks
          min={0}
          max={scrubberFramesMax - 1}
          valueLabelDisplay="auto"
          className='scrubberSlider__slider'
        />
      </div>
    </div>
  );
}

export default ScrubberSlider;
