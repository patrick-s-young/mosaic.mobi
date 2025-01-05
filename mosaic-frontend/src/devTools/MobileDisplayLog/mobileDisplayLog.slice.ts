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
      logText += action.payload.logText + '<br>';
      console.log('logText', logText);
      state.logText = logText;
    }
  }
});

export const {
  setLogText
} = mobileDisplayLogSlice.actions;

export type SetLogText = ReturnType <typeof setLogText>;

export default mobileDisplayLogSlice.reducer;
