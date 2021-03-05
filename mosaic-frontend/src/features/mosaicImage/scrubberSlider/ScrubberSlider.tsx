import * as React from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// Slice
import { setCurrentScrubberFrame } from 'features/mosaicImage/scrubberSlice';
import type { CurrentScrubberFrame, ScrubberState } from 'features/mosaicImage/scrubberSlice';
// Material-UI
import { Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  centerScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  slider: {
    width: '90%',
    "& .MuiSlider-thumb": {
      width:24,
      height: 24,
      marginTop: -12,
      marginLeft: -12
    },
    "& .MuiSlider-valueLabel": {
      left: 'calc(-50% + 8px)',
      top: -30
    }
  }
});

export interface ScrubberSliderProps {
  width: number
  height: number
}

const ScrubberSlider: React.FC<ScrubberSliderProps> = ({ width, height}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentScrubberFrame, scrubberFramesMax } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
  );

  const handleChange = (event: any, newValue: number | number[]) => {
    dispatch(setCurrentScrubberFrame(newValue as CurrentScrubberFrame));
  };

  function valuetext(value: number) {
    return `frame ${value}`;
  }

  return (
    <div style={{ width, height }}>
      <div className={classes.centerScreen}>
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
          className={classes.slider}
        />
      </div>
    </div>
  );
}

export default ScrubberSlider;
