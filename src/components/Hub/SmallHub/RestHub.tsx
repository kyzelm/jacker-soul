import style from './SmallHub.module.css';
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useEffect, useState} from "react";
import {PlayerActions, PlayerSave} from "../../../store/playerSlice.ts";
import {GamepadActions} from "../../../store/gamepadSlice.ts";

function RestHub() {
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown);
  const controls = useAppSelector(state => state.gamepad.controls);
  const restIndex = useAppSelector(state => state.hub.restIndex);
  const playerStats = useAppSelector(state => state.player.playerStats);
  const isEqHub = useAppSelector(state => state.hub.isEqHub);
  const dispatch = useAppDispatch();

  const [shouldSave, setShouldSave] = useState(false);
  const [oldDate, setOldDate] = useState("");

  function calculateHowManyLevelsToAdd(runes: number, level: number): [number, number] {
    const baseRunes = 500 * level;
    let levelsToAdd = 0;
    let runesToAdd = 0;
    while (runes >= baseRunes) {
      levelsToAdd++;
      runesToAdd += baseRunes;
      runes -= baseRunes;
    }
    return [levelsToAdd, runesToAdd];
  }

  useEffect(() => {
    if (buttonDown === controls.INTERACT && !isEqHub) {
      setOldDate(playerStats.date);
      if (playerStats.runes >= 500 * playerStats.level) {
        dispatch(PlayerActions.levelUp(calculateHowManyLevelsToAdd(playerStats.runes, playerStats.level)[0]));
        dispatch(PlayerActions.removeRunes(calculateHowManyLevelsToAdd(playerStats.runes, playerStats.level)[1]));
      }
      dispatch(PlayerActions.setSpawn(restIndex));
      dispatch(PlayerActions.setDate());
      setShouldSave(true);
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, controls.INTERACT, dispatch, isEqHub, playerStats, playerStats.date, playerStats.name, restIndex]);

  useEffect(() => {
    if (!shouldSave) return;

    const localStorage = window.localStorage.getItem("saves");
    if (localStorage) {
      let playerStatsArray = JSON.parse(localStorage) as PlayerSave[];
      playerStatsArray = playerStatsArray.filter((player) => player.date !== oldDate);
      playerStatsArray.push({...playerStats});
      window.localStorage.setItem("saves", JSON.stringify(playerStatsArray));
    } else {
      window.localStorage.setItem("saves", JSON.stringify([{...playerStats}]));
    }

    setShouldSave(false);
    setOldDate("");
  }, [oldDate, playerStats, restIndex, shouldSave]);

  return (
    <div className={style.smallModal}>
      <h2>Rest</h2>
    </div>
  )
}

export default RestHub;