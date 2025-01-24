import { traceEvent } from '@analytics/traceEvent';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/rootReducer';
import { setNumTiles } from '@components/MosaicTiles';
import type { MosaicState, NumTiles } from '@components/MosaicTiles';
import { Tab, Tabs } from '@material-ui/core';
import { TwoTilesIcon, ThreeTilesIcon, FourTilesIcon, SixTilesIcon, NineTilesIcon} from '@components/MosaicSelector/mosaicSelector.icons';
import './mosaicSelector.scss';


export interface MosaicSelectorProps {
  width: number
}

const MosaicSelector: React.FC<MosaicSelectorProps> = ({ width }) => {
  const dispatch = useDispatch();
  const { numTiles } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic as MosaicState
  );

  const handleChange = (_: React.ChangeEvent<{}>, newValue: NumTiles) => {
    traceEvent({
      category: 'Mosaic Selector',
      action: 'NUM_TILES CHANGE',
      label: newValue.toString()
    });
    dispatch(setNumTiles(newValue));
  };

  return (
    <div className='mosaicSelector' style={{ width }}>
      <Tabs
        value={numTiles}
        onChange={handleChange}
        aria-label="icon tabs example"
        className='mosaicSelector__tabs'
      >
        <Tab icon={<TwoTilesIcon fontSize='large' className='mosaicSelector__tabIcon' />} value={2} style={{ minWidth: width / 5 }} aria-label="two-tile mosaic" />
        <Tab icon={<ThreeTilesIcon fontSize='large' className='mosaicSelector__tabIcon' />} value={3} style={{ minWidth: width / 5 }} aria-label="three-tile mosaic" />
        <Tab icon={<FourTilesIcon fontSize='large' className='mosaicSelector__tabIcon' />} value={4} style={{ minWidth: width / 5 }} aria-label="four-tile mosaic" />
        <Tab icon={<SixTilesIcon fontSize='large' className='mosaicSelector__tabIcon' />} value={6} style={{ minWidth: width / 5 }} aria-label="six-tile mosaic" />
        <Tab icon={<NineTilesIcon fontSize='large' className='mosaicSelector__tabIcon' />} value={9} style={{ minWidth: width / 5 }} aria-label="nine-tile mosaic" />
      </Tabs>
  </div>
  );
}


export default MosaicSelector;