import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isLoading: boolean,
  greeting: string
}

const initialState: Partial<AppState> = {
  isLoading: undefined,
  greeting: 'Hello World!'
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoading (state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setGreeting (state, action: PayloadAction<string>) {
      state.greeting = action.payload;
    }
  }
});

export const {
  setIsLoading,
  setGreeting
} = appSlice.actions;

export type SetIsLoading = ReturnType<typeof setIsLoading>;
export type SetGreeting = ReturnType<typeof setGreeting>;

export default appSlice.reducer;