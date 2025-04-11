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
  axis: [StickValues, StickValues],
}

const initialState: GamepadStoreProps = {
  isConnected: false,
  buttonsDown: [],
  axis: [{x: 0, y: 0}, {x: 0, y: 0}],
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
      state.axis[0].x = Math.abs(action.payload.x) > 0.3 ? action.payload.x : 0;
      state.axis[0].y = Math.abs(action.payload.y) > 0.3 ? action.payload.y : 0;
    },
    setRightAxis: (state, action: PayloadAction<StickValues>) => {
      state.axis[1].x = Math.abs(action.payload.x) > 0.3 ? action.payload.x : 0;
      state.axis[1].y = Math.abs(action.payload.y) > 0.3 ? action.payload.y : 0;
    },
    clearData: (state) => {
      state.isConnected = false;
      state.buttonsDown = [];
      state.axis[0].x = 0;
      state.axis[0].y = 0;
      state.axis[1].x = 0;
      state.axis[1].y = 0;
    }
  },
});

export const GamepadActions = gamepadSlice.actions;
export const gamepadReducer = gamepadSlice.reducer;