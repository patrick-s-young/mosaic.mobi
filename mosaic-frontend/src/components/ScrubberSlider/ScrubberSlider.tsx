import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@typescript/types';
import { setCurrentScrubberFrame } from '@/components/Scrubber/scrubber.slice';
import { CurrentScrubberFrame } from '@typescript/types';
import { ScrubberState } from '@interfaces/ScrubberState';
import { ScrubberSliderProps } from '@interfaces/ScrubberSliderProps';
import { Slider } from '@material-ui/core';
import './scrubberSlider.scss';


const ScrubberSlider: React.FC<ScrubberSliderProps> = ({ width }) => {
  const dispatch = useDispatch();
  const { currentScrubberFrame, scrubberFramesMax } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
  );
  const trackWidth = width - 60;

  const handleChange = (_: any, newValue: number | number[]) => {
    dispatch(setCurrentScrubberFrame(newValue as CurrentScrubberFrame));
  };

  const valuetext = (value: number) => {
    return `frame ${value}`;
  }

  return (
    <div style={{ width: trackWidth }}>
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
