import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum MenuPages {
  NONE = 'none',
  HOME = 'home',
  NEW_GAME = 'new_game',
  LOAD_GAME = 'load_game',
  CONTROLS = 'controls',
}

interface MenuSliceProps {
  cursor: number;
  currentPage: MenuPages;
}

const initialState: MenuSliceProps = {
  cursor: 0,
  currentPage: MenuPages.HOME,
}

const menuSlice = createSlice({
  name: 'menu',
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
    setCurrentPage: (state, action: PayloadAction<MenuPages>) => {
      state.cursor = 0;
      state.currentPage = action.payload;
    },
  },
});

export const MenuActions = menuSlice.actions;
export const menuReducer = menuSlice.reducer;