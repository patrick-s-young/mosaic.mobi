import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NavSection = 'Upload Video' | 'Edit Mosaic' | 'Render Mosaic';

export interface NavState {
  navSection: NavSection
}

const initialState: NavState = {
  navSection: 'Upload Video'
}

const navSlice = createSlice ({
  name: 'nav',
  initialState,
  reducers: {
    setNavSection (state, action: PayloadAction<NavState>) {
      state.navSection = action.payload.navSection;
    }
  }
});

export const {
  setNavSection
} = navSlice.actions;

export type SetNavSection = ReturnType <typeof setNavSection>;

export default navSlice.reducer;
