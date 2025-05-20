import {JSX, useEffect} from "react";
import styles from "./MainHub.module.css";
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {GamepadActions} from "../../../store/gamepadSlice.ts";
import {HubActions} from "../../../store/hubSlice.ts";
import {Xbox360Button, Xbox360Dpad} from "@babylonjs/core";
import {PlayerActions} from "../../../store/playerSlice.ts";
import {MenuActions, MenuPages} from "../../../store/menuSlice.ts";

function MainHub(): JSX.Element {
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown);
  const controls = useAppSelector(state => state.gamepad.controls);
  const playerStats = useAppSelector(state => state.player.playerStats);
  const tmpStats = useAppSelector(state => state.player.tmpStats);
  const cursor = useAppSelector(state => state.hub.cursor);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (buttonDown === Xbox360Dpad.Down) {
      if (cursor < 2) {
        dispatch(HubActions.setCursor(cursor + 1));
      }
    }

    if (buttonDown === Xbox360Dpad.Up) {
      if (cursor > 0) {
        dispatch(HubActions.setCursor(cursor - 1));
      }
    }

    if (buttonDown === Xbox360Dpad.Right) {
      if (cursor === 0) {
        dispatch(PlayerActions.equipNextWeapon());
      } else if (cursor === 1) {
        dispatch(PlayerActions.equipNextArmor());
      } else if (cursor === 2) {
        dispatch(PlayerActions.equipNextAmulet());
      }
    }

    if (buttonDown === Xbox360Button.Y) {
      dispatch(MenuActions.setCurrentPage(MenuPages.HOME));
      dispatch(HubActions.closeEqHub());
    }

    if (buttonDown === controls.MENU) {
      dispatch(HubActions.closeEqHub());
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, controls.MENU, cursor, dispatch]);

  return (
    <div className={styles.mainHub}>
      <div>
        <h2>{playerStats.name}</h2>
        <h3>Level: {playerStats.level}</h3>
        <h3>Runes: {playerStats.runes}</h3>
        <h3>Max Health: {tmpStats.maxHealth}</h3>
        <h3>Defense: {tmpStats.defense}</h3>
        <h3>Damage: {tmpStats.damage}</h3>
      </div>
      <div>
        <h2>Equipped</h2>
        <h3 style={{scale: cursor === 0 ? 1.2 : 1}}>Weapon: {playerStats.equipped.weapon.toString()}</h3>
        <h3 style={{scale: cursor === 1 ? 1.2 : 1}}>Armor: {playerStats.equipped.armor.toString()}</h3>
        <h3 style={{scale: cursor === 2 ? 1.2 : 1}}>Amulet: {playerStats.equipped.amulet.toString()}</h3>
      </div>
    </div>
  );
}

export default MainHub;