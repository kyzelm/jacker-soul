import {DualShockButton, DualShockDpad, StickValues} from "@babylonjs/core";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ButtonsGroup = (DualShockButton | DualShockDpad | DualShockTrigger)

export enum DualShockTrigger {
  L1 = 16,
  R1 = 17,
}

interface GamepadStoreProps {
  isConnected: boolean;
  buttonsDown: ButtonsGroup[],
  axis: StickValues[],
}

const initialState: GamepadStoreProps = {
  isConnected: false,
  buttonsDown: [],
  axis: [],
}

const gamepadSlice = createSlice({
  name: 'gamepad',
  initialState,
  reducers: {
    setGamepadConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addButtonDown: (state, action: PayloadAction<ButtonsGroup>) => {
      if (!state.buttonsDown.includes(action.payload)) {
        state.buttonsDown.push(action.payload);
      }
    },
    removeButtonDown: (state, action: PayloadAction<ButtonsGroup>) => {
      state.buttonsDown = state.buttonsDown.filter(button => button !== action.payload);
    },
    setLeftAxis: (state, action: PayloadAction<StickValues>) => {
      state.axis[0] = action.payload;
    },
    setRightAxis: (state, action: PayloadAction<StickValues>) => {
      state.axis[1] = action.payload;
    },
    clearData: (state) => {
      state.isConnected = false;
      state.buttonsDown = [];
      state.axis = [];
    }
  },
});

export const GamepadActions = gamepadSlice.actions;
export const gamepadReducer = gamepadSlice.reducer;