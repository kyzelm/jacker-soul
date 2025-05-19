import {JSX, useEffect, useState} from "react";
import {BaseMenuProps} from "../Menu.tsx";
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {Xbox360Button} from "@babylonjs/core";
import {GamepadActions, PlayerAction} from "../../../store/gamepadSlice.ts";
import {MenuActions, MenuPages} from "../../../store/menuSlice.ts";

export default function MenuControls({cursor, buttonDown}: BaseMenuProps): JSX.Element {
  const settings = useAppSelector(state => state.gamepad.controls);
  const dispatch = useAppDispatch();

  const [isChanging, setIsChanging] = useState<boolean>(false);

  useEffect(() => {
    if (isChanging && buttonDown !== null && ((buttonDown >= 0 && buttonDown < 12) || (buttonDown > 15 && buttonDown < 18))) {
      setIsChanging(false);

      switch (cursor) {
        case 0:
          dispatch(GamepadActions.setControls({action: PlayerAction.JUMP, button: buttonDown as Xbox360Button}));
          break;
        case 1:
          dispatch(GamepadActions.setControls({action: PlayerAction.LIGHT_ATTACK, button: buttonDown as Xbox360Button}));
          break;
        case 2:
          dispatch(GamepadActions.setControls({action: PlayerAction.HEAVY_ATTACK, button: buttonDown as Xbox360Button}));
          break;
        case 3:
          dispatch(GamepadActions.setControls({action: PlayerAction.SPECIAL, button: buttonDown as Xbox360Button}));
          break;
        case 4:
          dispatch(GamepadActions.setControls({action: PlayerAction.ROLL, button: buttonDown as Xbox360Button}));
          break;
        case 5:
          dispatch(GamepadActions.setControls({action: PlayerAction.RUN, button: buttonDown as Xbox360Button}));
          break;
        case 6:
          dispatch(GamepadActions.setControls({action: PlayerAction.INTERACT, button: buttonDown as Xbox360Button}));
          break;
        case 7:
          dispatch(GamepadActions.setControls({action: PlayerAction.MENU, button: buttonDown as Xbox360Button}));
          break;
        case 8:
          dispatch(GamepadActions.setControls({action: PlayerAction.POTION, button: buttonDown as Xbox360Button}));
          break;
        default:
          break;
      }
    } else {
      if (buttonDown === Xbox360Button.A) {
        setIsChanging(true);
      }

      if (buttonDown === Xbox360Button.B) {
        dispatch(MenuActions.setCurrentPage(MenuPages.HOME));
      }
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, cursor, dispatch, isChanging]);

  return (
    <>
      <h1>Controls</h1>
      <div className="controls">
        {Object.entries(settings).map(([action, button], index) => (
          <div key={index} style={{scale: cursor === index ? 1.2 : 1}}>
            <span>{action}</span>
            <span>{button}</span>
          </div>
        ))}
      </div>
    </>
  );
}