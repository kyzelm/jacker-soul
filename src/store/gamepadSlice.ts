import {StickValues, Xbox360Button, Xbox360Dpad} from "@babylonjs/core";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ButtonsGroup = Xbox360Button | Xbox360Dpad | Xbox360Trigger | null;

export enum Xbox360Trigger {
  LT = 16,
  RT = 17,
}

export enum PlayerAction {
  JUMP = "JUMP",
  LIGHT_ATTACK = "LIGHT_ATTACK",
  HEAVY_ATTACK = "HEAVY_ATTACK",
  SPECIAL = "SPECIAL",
  ROLL = "ROLL",
  RUN = "RUN",
  INTERACT = "INTERACT",
  MENU = "MENU",
  POTION = "POTION",
}

interface GamepadStoreProps {
  isConnected: boolean;
  registerNext: boolean;
  buttonsDown: ButtonsGroup,
  axis: [StickValues, StickValues],
  controls: {
    [key in PlayerAction]: Xbox360Trigger | Xbox360Button
  }
}

const initialState: GamepadStoreProps = {
  isConnected: false,
  registerNext: false,
  buttonsDown: null,
  axis: [{x: 0, y: 0}, {x: 0, y: 0}],
  controls: {
    "JUMP": Xbox360Button.A,
    "LIGHT_ATTACK": Xbox360Button.RB,
    "HEAVY_ATTACK": Xbox360Button.LB,
    "SPECIAL": Xbox360Button.RightStick,
    "ROLL": Xbox360Button.B,
    "RUN": Xbox360Button.LeftStick,
    "INTERACT": Xbox360Button.Y,
    "MENU": Xbox360Button.Start,
    "POTION": Xbox360Button.X,
  }
}

const gamepadSlice = createSlice({
  name: 'gamepad',
  initialState,
  reducers: {
    setGamepadConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.registerNext = action.payload;
    },
    setButtonDown: (state, action: PayloadAction<ButtonsGroup>) => {
      if (state.registerNext) {
        state.buttonsDown = action.payload;
      }
    },
    buttonExecuted: (state) => {
      state.buttonsDown = null;
    },
    setControls: (state, action: PayloadAction<{
      action: PlayerAction,
      button: Xbox360Button | Xbox360Trigger
    }>) => {
      const existingAction = Object.entries(state.controls).findIndex(([, value]) => value === action.payload.button);
      if (existingAction !== -1) {
        const key = Object.keys(state.controls)[existingAction];
        state.controls[key as PlayerAction] = state.controls[action.payload.action];
      }
      state.controls = {...state.controls, [action.payload.action]: action.payload.button};
    },
    resetControls: (state) => {
        state.controls = initialState.controls;
    },
    setLeftAxis: (state, action: PayloadAction<StickValues>) => {
      state.axis[0].x = action.payload.x;
      state.axis[0].y = action.payload.y;
    },
    setRightAxis: (state, action: PayloadAction<StickValues>) => {
      state.axis[1].x = action.payload.x;
      state.axis[1].y = action.payload.y;
    },
    clearData: (state) => {
      state.isConnected = false;
      state.buttonsDown = null;
      state.axis[0].x = 0;
      state.axis[0].y = 0;
      state.axis[1].x = 0;
      state.axis[1].y = 0;
    }
  },
});

export const GamepadActions = gamepadSlice.actions;
export const gamepadReducer = gamepadSlice.reducer;