import {JSX} from "react";
import styles from "./ControllerModal.module.css";

export default function ControllerModal(): JSX.Element {
  return (
    <div className={styles.modal}>
      <h1>No controller</h1>
      <p>Connect and click any button to connect you controller</p>
    </div>
  );
}