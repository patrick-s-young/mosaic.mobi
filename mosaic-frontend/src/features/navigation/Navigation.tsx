import { traceEvent } from '@analytics/traceEvent';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@app/rootReducer';
// Slices
import { setNavPhase, NavPhaseEnum } from '@features/navigation/navSlice';
import type { NavState } from '@features/navigation/navSlice';
// Material-UI
import { Tab, Tabs } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SaveAlt, MovieCreation, VideoCall } from '@material-ui/icons';

const navPhaseString = {
  0: 'NAV_PHASE_CHANGED_UPLOAD',
  1: 'NAV_PHASE_CHANGED_EDIT',
  2: 'NAV_PHASE_CHANGED_DOWNLOAD'
}

const useStyles = makeStyles(() =>
  createStyles({
    centerScreen: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
);

export interface NavigationProps {
  width: number
  height: number
  pauseInput: boolean
}

export const Navigation: React.FC<NavigationProps> = ({ 
  width,
  pauseInput }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: NavPhaseEnum) => {
    traceEvent({
      category: 'Navigation',
      action: navPhaseString[newValue],
      label: 'N/A'
    });
    if (!pauseInput) dispatch(setNavPhase({navPhase: newValue}));
  };

  return (
    <div className={classes.centerScreen}  style={{ width }}>
      <Tabs
        value={navPhase}
        onChange={handleChange}
      >
        <Tab icon={<VideoCall fontSize='large' />} value={NavPhaseEnum.UPLOAD} style={{ minWidth: width / 3 }} label="UPLOAD" />
        <Tab icon={<MovieCreation fontSize='large' />} value={NavPhaseEnum.EDIT} style={{ minWidth: width / 3 }} label="EDIT" />
        <Tab icon={<SaveAlt fontSize='large' />} value={NavPhaseEnum.DOWNLOAD} style={{ minWidth: width / 3 }} label="SAVE" />
      </Tabs>
    </div>
  );
}