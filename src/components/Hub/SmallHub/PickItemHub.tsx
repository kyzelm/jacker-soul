import style from './SmallHub.module.css';
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useEffect} from "react";
import {Amulets, Armors, Weapons} from "../../../utils/eq.ts";
import {PlayerActions} from "../../../store/playerSlice.ts";
import {HubActions} from "../../../store/hubSlice.ts";
import {GamepadActions} from "../../../store/gamepadSlice.ts";

function PickItemHub() {
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown);
  const controls = useAppSelector(state => state.gamepad.controls);
  const pickHubIndex = useAppSelector(state => state.hub.pickHubIndex);
  const isEqHub = useAppSelector(state => state.hub.isEqHub);
  const playerStats = useAppSelector(state => state.player.playerStats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (buttonDown === controls.INTERACT && !isEqHub) {
      switch (pickHubIndex) {
        case 0:
          dispatch(PlayerActions.pickUpAmulet(Amulets.ASY_AMULET));
          dispatch(PlayerActions.addRunes(500));
          break;
        case 1:
          if (playerStats.type === "fast") {
            dispatch(PlayerActions.pickUpWeapon(Weapons.ASY_FIST));
          } else {
            dispatch(PlayerActions.pickUpWeapon(Weapons.ASY_SWORD));
          }
          break;
        case 2:
          dispatch(PlayerActions.pickUpArmor(Armors.ASY_ARMOR));
          break;
      }
      dispatch(HubActions.deletePickItem(pickHubIndex));
      dispatch(HubActions.closePickHub());
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, controls.INTERACT, dispatch, pickHubIndex, playerStats.type]);

  return (
    <div className={style.smallModal}>
      <h2>Pick:</h2>
      <p>{(() => {
        switch (pickHubIndex) {
          case 0:
            return Amulets.ASY_AMULET.toString() + " + 500 run";
          case 1:
            return playerStats.type === "fast" ? Weapons.ASY_FIST.toString() : Weapons.ASY_SWORD.toString()
          case 2:
            return Armors.ASY_ARMOR.toString()
        }
      })()}</p>
    </div>
  )
}

export default PickItemHub;