import {useCallback, useEffect, useRef, useState} from "react";
import {DualShockPad, Gamepad, GamepadManager, StickValues} from "@babylonjs/core";
import {ButtonsGroup, DualShockTrigger, GamepadActions} from "../store/gamepadSlice.ts";
import {useAppDispatch} from "../store/store.ts";


export function useGamepadController(): void {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const dispatch = useAppDispatch();

  const gamepadManager = useRef<GamepadManager>(new GamepadManager());

  const buttonDownHandler = useCallback((button: ButtonsGroup) => {
    dispatch(GamepadActions.addButtonDown(button));
  }, [dispatch]);

  const buttonUpHandler = useCallback((button: ButtonsGroup) => {
    dispatch(GamepadActions.removeButtonDown(button));
  }, [dispatch]);

  const triggerHandler = useCallback((trigger: DualShockTrigger, value: number) => {
    if (value > 0) {
      buttonDownHandler(trigger);
    } else {
      buttonUpHandler(trigger);
    }
  }, [buttonDownHandler, buttonUpHandler]);

  const stickHandler = useCallback((side: 0 | 1, values: StickValues) => {
    if (side === 0) {
      dispatch(GamepadActions.setLeftAxis(values));
    } else if (side === 1) {
      dispatch(GamepadActions.setRightAxis(values));
    }
  }, [dispatch]);

  useEffect(() => {
    gamepadManager.current.onGamepadConnectedObservable.add((gamepad) => {
      setGamepads((prevGamepads) => [...prevGamepads, gamepad]);

      if (gamepad instanceof DualShockPad) {
        console.log("DualShockPad connected:", gamepad);
        gamepad.onButtonDownObservable.add(buttonDownHandler);
        gamepad.onPadDownObservable.add(buttonDownHandler);
        gamepad.onButtonUpObservable.add(buttonUpHandler);
        gamepad.onPadUpObservable.add(buttonUpHandler);
        gamepad.onlefttriggerchanged((value) => {
          triggerHandler(DualShockTrigger.L1, value);
        });
        gamepad.onrighttriggerchanged((value) => {
          triggerHandler(DualShockTrigger.R1, value);
        })
        gamepad.onleftstickchanged((values) => {
          stickHandler(0, values);
        })
        gamepad.onrightstickchanged((values) => {
          stickHandler(1, values);
        })
      }
    })

    gamepadManager.current.onGamepadDisconnectedObservable.add((gamepad) => {
      console.log("Gamepad disconnected:", gamepad);
      setGamepads((prevGamepads) =>
        prevGamepads.filter((g) => g.index !== gamepad.index)
      );
    });
  }, [buttonDownHandler, buttonUpHandler, stickHandler, triggerHandler])

  useEffect(() => {
    if (gamepads.length > 1) {
      dispatch(GamepadActions.setGamepadConnected(true));
    } else {
      dispatch(GamepadActions.clearData());
    }
  }, [gamepads.length, dispatch]);
}