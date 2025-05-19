import {JSX, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {Xbox360Dpad} from "@babylonjs/core";
import {MenuActions, MenuPages} from "../../store/menuSlice.ts";
import {ButtonsGroup} from "../../store/gamepadSlice.ts";
import styles from "./Menu.module.css";
import MenuHome from "./MenuPages/MenuHome.tsx";
import MenuNewGame from "./MenuPages/MenuNewGame.tsx";
import {PlayerSave} from "../../store/playerSlice.ts";
import {MenuLoadGame} from "./MenuPages/MenuLoadGame.tsx";
import MenuControls from "./MenuPages/MenuControls.tsx";

export interface BaseMenuProps {
  cursor: number;
  buttonDown: ButtonsGroup;
}

function Menu(): JSX.Element {
  const currentPage = useAppSelector(state => state.menu.currentPage)
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown)
  const cursor = useAppSelector(state => state.menu.cursor)
  const dispatch = useAppDispatch()
  const [playerSaves, setPlayerSaves] = useState<PlayerSave[]>([])

  useEffect(() => {
    if (playerSaves.length === 0) {
      setPlayerSaves(JSON.parse(localStorage.getItem("saves") || "[]"));
    }
  }, [playerSaves]);

  useEffect(() => {
    if (buttonDown === Xbox360Dpad.Up) {
      dispatch(MenuActions.cursorUp());
    }
    if (buttonDown === Xbox360Dpad.Down) {
      dispatch(MenuActions.cursorDown());
    }
  }, [buttonDown, dispatch])

  useEffect(() => {
    let i = 0;

    switch (currentPage) {
      case MenuPages.HOME:
        i = 2;
        break;
      case MenuPages.NEW_GAME:
        i = 1;
        break;
      case MenuPages.LOAD_GAME:
        i = playerSaves.length - 1;
        break;
      case MenuPages.CONTROLS:
        i = 8;
        break;
    }

    if (cursor > i) {
      dispatch(MenuActions.setCursor(i));
    }
  }, [currentPage, cursor, dispatch, playerSaves.length]);

  return (
    <div className={styles.menu}>
      {((): JSX.Element => {
        switch (currentPage) {
          case MenuPages.NONE:
            return <></>;
          case MenuPages.HOME:
            return <MenuHome cursor={cursor} buttonDown={buttonDown}/>;
          case MenuPages.NEW_GAME:
            return <MenuNewGame cursor={cursor} buttonDown={buttonDown}/>
          case MenuPages.LOAD_GAME:
            return <MenuLoadGame cursor={cursor} buttonDown={buttonDown} playerSaves={playerSaves}/>
          case MenuPages.CONTROLS:
            return <MenuControls cursor={cursor} buttonDown={buttonDown}/>
          default:
            dispatch(MenuActions.setCurrentPage(MenuPages.HOME));
            return <></>;
        }
      })()}
    </div>
  );
}

export default Menu;