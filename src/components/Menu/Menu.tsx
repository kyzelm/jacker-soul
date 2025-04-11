import {JSX, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {DualShockDpad} from "@babylonjs/core";
import {MenuActions, MenuPages} from "../../store/menuSlice.ts";
import {GamepadActions} from "../../store/gamepadSlice.ts";
import styles from "./Menu.module.css";

interface BaseMenuProps {
  cursor: number;
}

function MenuHome({cursor}: BaseMenuProps): JSX.Element {
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

function Menu(): JSX.Element {
  const currentPage = useAppSelector(state => state.menu.currentPage)
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown)
  const cursor = useAppSelector(state => state.menu.cursor)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (buttonDown.includes(DualShockDpad.Up)) {
      dispatch(MenuActions.cursorUp());
      dispatch(GamepadActions.removeButtonDown(DualShockDpad.Up));
    }
    if (buttonDown.includes(DualShockDpad.Down)) {
      dispatch(MenuActions.cursorDown());
      dispatch(GamepadActions.removeButtonDown(DualShockDpad.Down));
    }
  }, [buttonDown, dispatch])

  useEffect(() => {
    let i = 0;

    switch (currentPage) {
      case MenuPages.HOME:
        i = 4;
        break;
    }

    if (cursor > i) {
      dispatch(MenuActions.setCursor(i));
    }
  }, [currentPage, cursor, dispatch]);

  return (
    <div className={styles.menu}>
      {((): JSX.Element => {
        switch (currentPage) {
          case MenuPages.HOME:
            return <MenuHome cursor={cursor}/>;
          default:
            return <h1>Page not found</h1>;
        }
      })()}
    </div>
  );
}

export default Menu;