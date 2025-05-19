import style from './RestHub.module.css';
import {useAppSelector} from "../../../store/store.ts";
import {useEffect} from "react";
import {PlayerSave} from "../../../store/playerSlice.ts";

function RestHub() {
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown);
  const controls = useAppSelector(state => state.gamepad.controls);
  const restIndex = useAppSelector(state => state.hub.restIndex);
  const playerStats = useAppSelector(state => state.player.playerStats);

  useEffect(() => {
    if (buttonDown === controls.INTERACT) {
      const localStorage = window.localStorage.getItem("saves");
      if (localStorage) {
        let playerStatsArray = JSON.parse(localStorage) as PlayerSave[];
        playerStatsArray = playerStatsArray.filter((player) => player.date !== playerStats.date);
        playerStatsArray.push({...playerStats, date: new Date().toString(), spawn: restIndex});
        window.localStorage.setItem("saves", JSON.stringify(playerStatsArray));
      } else {
        window.localStorage.setItem("saves", JSON.stringify({...playerStats, date: new Date().toString(), spawn: restIndex}));
      }
    }
  }, [buttonDown, controls.INTERACT, playerStats, playerStats.date, playerStats.name, restIndex]);

  return (
    <div className={style.restModal}>
      <h2>Rest</h2>
    </div>
  )
}

export default RestHub;