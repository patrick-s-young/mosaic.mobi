import { traceEvent } from '@analytics/traceEvent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store/rootReducer';
import { setNavPhase, NavPhaseEnum } from '@/components/Navigation/navSlice';
import type { NavState } from '@/components/Navigation/navSlice';
import { Tab, Tabs } from '@material-ui/core';
import { SaveAlt, MovieCreation, VideoCall } from '@material-ui/icons';
import './navigation.scss';

const navPhaseString = {
  0: 'NAV_PHASE_CHANGED_UPLOAD',
  1: 'NAV_PHASE_CHANGED_EDIT',
  2: 'NAV_PHASE_CHANGED_DOWNLOAD'
}


export interface NavigationProps {
  width: number
  height: number
  pauseInput: boolean
}

const Navigation: React.FC<NavigationProps> = ({ 
  width,
  pauseInput }) => {
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);
  const navigationWidth = width;
  const tabStyle = {
    minWidth: navigationWidth / 3,
    backgroundColor: 'white'
  }

  const handleChange = (_: React.ChangeEvent<{}>, newValue: NavPhaseEnum) => {
    traceEvent({
      category: 'Navigation',
      action: navPhaseString[newValue],
      label: 'N/A'
    });
    if (!pauseInput) dispatch(setNavPhase({navPhase: newValue}));
  };

  return (
    <div className='navigation' style={{ width: navigationWidth }}>
      <Tabs
        value={navPhase}
        onChange={handleChange}
      >
        <Tab icon={<VideoCall fontSize='large' />} value={NavPhaseEnum.UPLOAD} style={tabStyle} label="UPLOAD" />
        <Tab icon={<MovieCreation fontSize='large' />} value={NavPhaseEnum.EDIT} style={tabStyle} label="EDIT" />
        <Tab icon={<SaveAlt fontSize='large' />} value={NavPhaseEnum.DOWNLOAD} style={tabStyle} label="SAVE" />
      </Tabs>
    </div>
  );
}

export default Navigation;