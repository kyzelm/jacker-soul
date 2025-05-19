import { configureStore } from '@reduxjs/toolkit'
import {useDispatch, useSelector} from "react-redux";
import {gamepadReducer} from "./gamepadSlice.ts";
import {menuReducer} from "./menuSlice.ts";
import {playerReducer} from "./playerSlice.ts";
import {hubReducer} from "./hubSlice.ts";

export const store = configureStore({
  reducer: {
    gamepad: gamepadReducer,
    menu: menuReducer,
    hub: hubReducer,
    player: playerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
