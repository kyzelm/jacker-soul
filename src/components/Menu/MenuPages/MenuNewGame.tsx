import {JSX, useEffect, useState} from "react";
import {BaseMenuProps} from "../Menu.tsx";
import {Xbox360Button} from "@babylonjs/core";
import {useAppDispatch} from "../../../store/store.ts";
import {MenuActions, MenuPages} from "../../../store/menuSlice.ts";
import {GamepadActions} from "../../../store/gamepadSlice.ts";
import {PlayerActions} from "../../../store/playerSlice.ts";
import {Amulets, Armors, Weapons} from "../../../utils/eq.ts";

const nameList: string[] = [
  "Joroh",
  "Gaara",
  "Nakiba",
  "Jin",
  "Costus",
  "Jacker",
  "Krass"
]

export default function MenuNewGame({cursor, buttonDown}: BaseMenuProps): JSX.Element {
  const [name, setName] = useState<string>(nameList[Math.floor(100 * Math.random()) % nameList.length]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    switch (buttonDown) {
      case Xbox360Button.X:
        setName(nameList[Math.floor(100 * Math.random()) % nameList.length]);
        break;
      case Xbox360Button.A:
        dispatch(PlayerActions.setPlayerStats({
          name: name,
          level: 1,
          date: new Date().toString(),
          type: cursor === 0 ? "fast" : "slow",
          spawn: 0,
          runes: 0,
          equipped: {
            weapon: cursor === 0 ? Weapons.FIST_OF_JACKER : Weapons.SWORD_OF_JACKER,
            armor: Armors.JACKER_ARMOR,
            amulet: Amulets.JACKER_AMULET,
          },
          inventory: {
            weapons: [cursor === 0 ? Weapons.FIST_OF_JACKER : Weapons.SWORD_OF_JACKER],
            armors: [Armors.JACKER_ARMOR],
            amulets: [Amulets.JACKER_AMULET],
          }
        }))
        dispatch(MenuActions.setCurrentPage(MenuPages.NONE));
        break;
      case Xbox360Button.B:
        dispatch(MenuActions.setCurrentPage(MenuPages.HOME));
        break;
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, cursor, dispatch, name]);

  return (
    <>
      <h1>New Game</h1>
      <p>Choose name:</p>
      <h2>{name}</h2>
      <p>Choose style:</p>
      <div style={{scale: cursor === 0 ? "1.2" : "1"}}>
        <h2>Fast</h2>
        <p>Dagger img</p>
      </div>
      <div style={{scale: cursor === 1 ? "1.2" : "1"}}>
        <h2>Slow</h2>
        <p>Big sword img</p>
      </div>
    </>
  );
}