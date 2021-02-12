import * as React from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// Slices
import { setNavPhase, NavPhaseEnum } from 'features/navigation/navSlice';
import type { NavState } from 'features/navigation/navSlice';
// Material-UI
import { Tab, Tabs } from '@material-ui/core';

export interface NavigationProps {
  width: number
  height: number
  pauseInput: boolean
}

export const Navigation: React.FC<NavigationProps> = ({ 
  width,
  height,
  pauseInput }) => {

  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: NavPhaseEnum) => {
    if (!pauseInput) dispatch(setNavPhase({navPhase: newValue}));
  };

  return (
    <div style={{ width }}>
      <Tabs
        value={navPhase}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab value={NavPhaseEnum.UPLOAD} style={{ minWidth: width / 3 }} label="UPLOAD" />
        <Tab value={NavPhaseEnum.EDIT} style={{ minWidth: width / 3 }} label="EDIT" />
        <Tab value={NavPhaseEnum.DOWNLOAD} style={{ minWidth: width / 3 }} label="SAVE" />
      </Tabs>
    </div>
  );
}