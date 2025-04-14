import {DualShockButton, DualShockDpad, StickValues} from "@babylonjs/core";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ButtonsGroup = DualShockButton | DualShockDpad | DualShockTrigger | null;

export enum DualShockTrigger {
  L2 = 16,
  R2 = 17,
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
    [key in PlayerAction]: DualShockTrigger | DualShockButton
  }
}

const initialState: GamepadStoreProps = {
  isConnected: false,
  registerNext: false,
  buttonsDown: null,
  axis: [{x: 0, y: 0}, {x: 0, y: 0}],
  controls: {
    "JUMP": DualShockButton.Cross,
    "LIGHT_ATTACK": DualShockButton.R1,
    "HEAVY_ATTACK": DualShockTrigger.R2,
    "SPECIAL": DualShockButton.L1,
    "ROLL": DualShockButton.Circle,
    "RUN": DualShockButton.LeftStick,
    "INTERACT": DualShockButton.Triangle,
    "MENU": DualShockButton.Options,
    "POTION": DualShockButton.Square,
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
      button: DualShockButton | DualShockTrigger
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
      state.axis[0].x = Math.abs(action.payload.x) > 0.3 ? action.payload.x : 0;
      state.axis[0].y = Math.abs(action.payload.y) > 0.3 ? action.payload.y : 0;
    },
    setRightAxis: (state, action: PayloadAction<StickValues>) => {
      state.axis[1].x = Math.abs(action.payload.x) > 0.3 ? action.payload.x : 0;
      state.axis[1].y = Math.abs(action.payload.y) > 0.3 ? action.payload.y : 0;
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