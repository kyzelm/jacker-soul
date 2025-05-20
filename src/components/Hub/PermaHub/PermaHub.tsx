import {useAppSelector} from "../../../store/store.ts";
import styles from "./PermaHub.module.css";

function PermaHub() {
  const tmpStats = useAppSelector(state => state.player.tmpStats);

  return <div className={styles.permaHub}>
    <h2>Hp: {tmpStats.health} / {tmpStats.maxHealth}</h2>
    <h2>Flasks: {tmpStats.flasks}</h2>
  </div>
}

export default PermaHub;