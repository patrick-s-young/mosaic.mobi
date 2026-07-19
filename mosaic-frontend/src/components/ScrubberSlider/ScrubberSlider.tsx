import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@typescript/types';
import { setCurrentScrubberFrame, setCarouselMode } from '@/components/Scrubber/scrubber.slice';
import { CurrentScrubberFrame } from '@typescript/types';
import { ScrubberState } from '@interfaces/ScrubberState';
import { ScrubberSliderProps } from '@interfaces/ScrubberSliderProps';
import { Slider } from '@material-ui/core';
import './scrubberSlider.scss';


const ScrubberSlider: React.FC<ScrubberSliderProps> = ({ width }) => {
  const dispatch = useDispatch();
  const { currentScrubberFrame, scrubberFramesMax, carouselMode } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
  );
  const trackWidth = width - 60;

  const handleChange = (_: any, newValue: number | number[]) => {
    if (carouselMode) return;
    dispatch(setCurrentScrubberFrame(newValue as CurrentScrubberFrame));
  };

  const valuetext = (value: number) => {
    return `frame ${value}`;
  }

  const toggleCarousel = () => {
    dispatch(setCarouselMode({ carouselMode: !carouselMode }));
  };

  return (
    <div className='scrubberSlider__row' style={{ width: trackWidth }}>
      <button
        type='button'
        className={`scrubberSlider__toggle ${carouselMode ? 'scrubberSlider__toggle--active' : ''}`}
        onClick={toggleCarousel}
        aria-pressed={carouselMode}
        aria-label={carouselMode ? 'Switch to slider mode' : 'Switch to carousel mode'}
        title={carouselMode ? 'Slider mode' : 'Carousel mode'}
      >
        {/* slideshow / carousel icon: a centered frame flanked by its neighbours */}
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <rect x='7.5' y='5' width='9' height='14' rx='1.5' stroke='currentColor' strokeWidth='2' />
          <path d='M4 8v8M20 8v8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        </svg>
      </button>
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
          disabled={carouselMode}
          className='scrubberSlider__slider'
        />
      </div>
    </div>
  );
}

export default ScrubberSlider;
