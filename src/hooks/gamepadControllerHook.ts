import {useCallback, useEffect, useRef, useState} from "react";
import {Gamepad, GamepadManager, StickValues, Xbox360Pad} from "@babylonjs/core";
import {ButtonsGroup, Xbox360Trigger, GamepadActions} from "../store/gamepadSlice.ts";
import {useAppDispatch} from "../store/store.ts";


export function useGamepadController(): void {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const dispatch = useAppDispatch();

  const gamepadManager = useRef<GamepadManager>(new GamepadManager());

  const buttonDownHandler = useCallback((button: ButtonsGroup) => {
    dispatch(GamepadActions.setButtonDown(button));
  }, [dispatch]);

  const triggerHandler = useCallback((trigger: Xbox360Trigger, value: number) => {
    if (value > 0.1) {
      buttonDownHandler(trigger);
    }
  }, [buttonDownHandler]);

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

      if (gamepad instanceof Xbox360Pad) {
        console.log("XboxPad connected:", gamepad);
        gamepad.onButtonDownObservable.add(buttonDownHandler);
        gamepad.onPadDownObservable.add(buttonDownHandler);
        gamepad.onlefttriggerchanged((value) => {
          triggerHandler(Xbox360Trigger.LT, value);
        });
        gamepad.onrighttriggerchanged((value) => {
          triggerHandler(Xbox360Trigger.RT, value);
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
  }, [buttonDownHandler, stickHandler, triggerHandler])

  useEffect(() => {
    if (gamepads.length > 1) {
      dispatch(GamepadActions.setGamepadConnected(true));
    } else {
      dispatch(GamepadActions.clearData());
    }
  }, [gamepads.length, dispatch]);
}