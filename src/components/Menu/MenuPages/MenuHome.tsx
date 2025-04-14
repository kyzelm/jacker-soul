import {JSX, useEffect} from "react";
import {useAppDispatch} from "../../../store/store.ts";
import {DualShockButton} from "@babylonjs/core";
import {MenuActions, MenuPages} from "../../../store/menuSlice.ts";
import {BaseMenuProps} from "../Menu.tsx";
import {GamepadActions} from "../../../store/gamepadSlice.ts";

export default function MenuHome({cursor, buttonDown}: BaseMenuProps): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (buttonDown == DualShockButton.Cross) {
      switch (cursor) {
        case 0:
          dispatch(MenuActions.setCurrentPage(MenuPages.NEW_GAME));
          break;
        case 1:
          dispatch(MenuActions.setCurrentPage(MenuPages.LOAD_GAME));
          break;
        case 2:
          dispatch(MenuActions.setCurrentPage(MenuPages.CONTROLS));
          break;
      }
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, cursor, dispatch]);

  return (
    <>
      <h1>Jacker Soul</h1>
      <ul>
        <li style={{scale: cursor === 0 ? "1.2" : "1"}}>New Game</li>
        <li style={{scale: cursor === 1 ? "1.2" : "1"}}>Load Game</li>
        <li style={{scale: cursor === 2 ? "1.2" : "1"}}>Controls</li>
      </ul>
    </>
  );
}