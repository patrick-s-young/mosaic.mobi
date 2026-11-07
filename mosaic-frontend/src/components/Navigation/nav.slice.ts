import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavPhaseEnum } from '@enums/NavPhaseEnum';
import { NavState } from '@interfaces/NavState';  

const initialState: NavState = {
  // the editor opens straight away, showing a poster until the demo is ready
  navPhase: NavPhaseEnum.EDIT
}

const navSlice = createSlice ({
  name: 'nav',
  initialState,
  reducers: {
    setNavPhase (state, action: PayloadAction<{ navPhase: NavPhaseEnum }>) {
      state.navPhase = action.payload.navPhase;
    }
  }
});

export const {
  setNavPhase
} = navSlice.actions;

export default navSlice.reducer;
