import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface HubSliceProps {
  cursor: number;
  isRestHub: boolean;
  restIndex: number;
  isEqHub: boolean;
}

const initialState: HubSliceProps = {
  cursor: 0,
  isRestHub: false,
  restIndex: 0,
  isEqHub: false,
}

const hubSlice = createSlice({
  name: 'hub',
  initialState,
  reducers: {
    setCursor: (state, action: PayloadAction<number>) => {
      state.cursor = action.payload;
    },
    cursorUp: (state) => {
      if (state.cursor > 0) {
        state.cursor -= 1;
      }
    },
    cursorDown: (state) => {
      state.cursor += 1;
    },
    resetCursor: (state) => {
      state.cursor = 0;
    },
    openRestHub: (state, action: PayloadAction<number>) => {
      state.isRestHub = true;
      state.restIndex = action.payload;
    },
    closeRestHub: (state) => {
      state.isRestHub = false;
      state.restIndex = 0;
    },
    openEqHub: (state) => {
      state.isEqHub = true;
    },
    closeEqHub: (state) => {
      state.isEqHub = false;
    },
  },
});

export const HubActions = hubSlice.actions;
export const hubReducer = hubSlice.reducer;