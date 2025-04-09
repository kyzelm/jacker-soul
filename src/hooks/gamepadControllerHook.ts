import {useCallback, useEffect, useRef, useState} from "react";
import {DualShockButton, DualShockDpad, DualShockPad, Gamepad, GamepadManager, StickValues} from "@babylonjs/core";

export enum DualShockTrigger {
  L1 = 16,
  R1 = 17,
}

export function useGamepadController(): [boolean, (DualShockButton | DualShockDpad | DualShockTrigger)[], StickValues[]] {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const [isGamepadConnected, setIsGamepadConnected] = useState<boolean>(false);
  const [buttonsDown, setButtonsDown] = useState<(DualShockButton | DualShockDpad | DualShockTrigger)[]>([]);
  const [axis, setAxis] = useState<StickValues[]>([]);

  const gamepadManager = useRef<GamepadManager>(new GamepadManager());

  function buttonDownHandler(button: DualShockButton | DualShockDpad | DualShockTrigger) {
    console.log("Button pressed:", button);
    setButtonsDown((prevButtons) => prevButtons.includes(button) ? prevButtons : [...prevButtons, button]);
  }

  function buttonUpHandler(button: DualShockButton | DualShockDpad | DualShockTrigger) {
    console.log("Button released:", button);
    setButtonsDown((prevButtons) =>
      prevButtons.filter((b) => b !== button)
    );
  }

  const triggerHandler = useCallback((trigger: DualShockTrigger, value: number) => {
    if (value > 0) {
      buttonDownHandler(trigger);
    } else {
      buttonUpHandler(trigger);
    }
  }, []);

  const stickHandler = useCallback((index: number, values: StickValues) => {
    setAxis((prevAxis) => {
      const newAxis = [...prevAxis];
      newAxis[index] = values;
      return newAxis;
    });
  }, []);

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
  }, [stickHandler, triggerHandler])

  useEffect(() => {
    setIsGamepadConnected(gamepads.length > 0);
    if (!isGamepadConnected) {
      setButtonsDown([])
    }
  }, [gamepads.length, isGamepadConnected]);

  return [isGamepadConnected, buttonsDown, axis];
}