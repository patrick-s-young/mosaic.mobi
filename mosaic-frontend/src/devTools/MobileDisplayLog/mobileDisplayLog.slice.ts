import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileDisplayLog {
  logText: string
}

export type MobileDisplayLogState = MobileDisplayLog;

const initialState: MobileDisplayLog = {
  logText: ''
}

const mobileDisplayLogSlice = createSlice ({
  name: 'mobileDisplayLog',
  initialState,
  reducers: {
    setLogText (state, action: PayloadAction<MobileDisplayLog>) {
      let logText = state.logText;
      logText += action.payload.logText + '<br>_';
      state.logText = logText;
    },
    clearLogText (state) {
      state.logText = '';
    }
  }
});

export const {
  setLogText,
  clearLogText
} = mobileDisplayLogSlice.actions;

export type SetLogText = ReturnType <typeof setLogText>;
export type ClearLogText = ReturnType <typeof clearLogText>;

export default mobileDisplayLogSlice.reducer;
