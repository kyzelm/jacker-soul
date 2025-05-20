import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface HubSliceProps {
  cursor: number;
  isRestHub: boolean;
  restIndex: number;
  isPickHub: boolean;
  pickHubIndex: number;
  deletePickItem: number | null;
  isEqHub: boolean;
}

const initialState: HubSliceProps = {
  cursor: 0,
  isRestHub: false,
  restIndex: 0,
  isPickHub: false,
  pickHubIndex: 0,
  deletePickItem: null,
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
    openPickHub: (state, action: PayloadAction<number>) => {
      state.isPickHub = true;
      state.pickHubIndex = action.payload;
    },
    closePickHub: (state) => {
      state.isPickHub = false;
      state.pickHubIndex = 0;
    },
    deletePickItem: (state, action: PayloadAction<number | null>) => {
      state.deletePickItem = action.payload;
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