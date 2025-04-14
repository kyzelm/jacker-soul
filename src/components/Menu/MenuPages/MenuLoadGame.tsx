import {JSX, useEffect} from "react";
import {BaseMenuProps} from "../Menu.tsx";
import {PlayerActions, PlayerSave} from "../../../store/playerSlice.ts";
import {DualShockButton} from "@babylonjs/core";
import {useAppDispatch} from "../../../store/store.ts";
import {MenuActions, MenuPages} from "../../../store/menuSlice.ts";
import {GamepadActions} from "../../../store/gamepadSlice.ts";

interface MenuLoadGameProps extends BaseMenuProps{
  playerSaves: PlayerSave[];
}

export function MenuLoadGame({playerSaves, cursor, buttonDown}: MenuLoadGameProps): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (buttonDown === DualShockButton.Cross) {
      if (playerSaves.length > 0) {
        console.log("Loading game:", playerSaves[cursor]);
        dispatch(PlayerActions.setPlayerStats(playerSaves[cursor]));
      }
    }
    if (buttonDown === DualShockButton.Circle) {
      dispatch(MenuActions.setCurrentPage(MenuPages.HOME));
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, cursor, dispatch, playerSaves]);

  return <>
    {playerSaves.length > 0 ? playerSaves.map((save, index) => (
      <div key={index} style={{scale: cursor === index ? "1.2" : "1"}}>
        <h2>{save.name}</h2>
        <p>
          {new Date(save.date).toLocaleDateString()} {new Date(save.date).toLocaleTimeString()}
        </p>
        <p>Level: {save.level}</p>
      </div>
    )) : (
      <div>
        <h2>No saved games</h2>
        <p>Please create a new game first.</p>
      </div>
    )}
  </>;
}