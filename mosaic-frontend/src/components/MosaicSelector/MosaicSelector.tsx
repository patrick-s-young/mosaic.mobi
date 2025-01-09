import { traceEvent } from '@analytics/traceEvent';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/rootReducer';
import { setNumTiles } from '@/components/MosaicTiles';
import type { MosaicState, NumTiles } from '@/components/MosaicTiles';
// Material-UI
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TwoTilesIcon, ThreeTilesIcon, FourTilesIcon, SixTilesIcon, NineTilesIcon} from '@/components/MosaicSelector/mosaicSelectorIcons';

const useStyles = makeStyles({
  root: {
    zIndex: 10
  },
  centerScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export interface MosaicSelectorProps {
  width: number
}

const MosaicSelector: React.FC<MosaicSelectorProps> = ({ width }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { numTiles } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic as MosaicState
  );

  const handleChange = (_: React.ChangeEvent<{}>, newValue: NumTiles) => {
    traceEvent({
      category: 'Mosaic Selector',
      action: `NUM_TILES CHANGE: ${newValue.toString()}`,
      label: 'N/A'
    });
    dispatch(setNumTiles(newValue));
  };

  return (
    <div className={classes.centerScreen} style={{ width }}>
      <Tabs
        value={numTiles}
        onChange={handleChange}
        aria-label="icon tabs example"
        className={classes.root}
      >
        <Tab icon={<TwoTilesIcon fontSize='large' />} value={2} style={{ minWidth: width / 5 }} aria-label="two-tile mosaic" />
        <Tab icon={<ThreeTilesIcon fontSize='large' />} value={3} style={{ minWidth: width / 5 }} aria-label="three-tile mosaic" />
        <Tab icon={<FourTilesIcon fontSize='large' />} value={4} style={{ minWidth: width / 5 }} aria-label="four-tile mosaic" />
        <Tab icon={<SixTilesIcon fontSize='large' />} value={6} style={{ minWidth: width / 5 }} aria-label="six-tile mosaic" />
        <Tab icon={<NineTilesIcon fontSize='large' />} value={9} style={{ minWidth: width / 5 }} aria-label="nine-tile mosaic" />
      </Tabs>
  </div>
  );
}


export default MosaicSelector;