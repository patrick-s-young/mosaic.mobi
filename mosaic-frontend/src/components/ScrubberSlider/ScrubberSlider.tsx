import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@typescript/types';
import { setCurrentScrubberFrame, setIsScrubbing } from '@/components/Scrubber/scrubber.slice';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';
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

  // fade the mosaic tiles to 25% while the knob is held so the background image
  // is easier to see; restore full opacity when the interaction ends
  const startScrubbing = () => dispatch(setIsScrubbing(true));
  const stopScrubbing = (_: any, value: number | number[]) => {
    dispatch(setIsScrubbing(false));
    // log the frame the user landed on (once, on release — not every drag tick)
    logEvent(AnalyticsEvent.SELECT_BACKGROUND_FRAME, { frame: value as number });
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
          onMouseDown={startScrubbing}
          onTouchStart={startScrubbing}
          onChangeCommitted={stopScrubbing}
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
