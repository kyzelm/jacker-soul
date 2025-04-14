import {JSX, useEffect} from "react";
import SceneComponent from "babylonjs-hook";
import {FreeCamera, HemisphericLight, ImportMeshAsync, Scene, Vector3} from "@babylonjs/core";
import styles from "./GameEngine.module.css";
import {useAppSelector} from "../../store/store.ts";
import "@babylonjs/loaders";

export default function GameEngine(): JSX.Element {
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown)

  useEffect(() => {
  }, [buttonDown]);

  const onSceneReady = async (scene: Scene) => {
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());

    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const level = await ImportMeshAsync("./models/Prototype_Level.glb", scene)

    console.log(level);
  };

  const onRender = () => {
  };

  return (
    <SceneComponent
      antialias={true}
      engineOptions={{preserveDrawingBuffer: true, stencil: true}}
      adaptToDeviceRatio={true}
      onSceneReady={onSceneReady}
      onRender={onRender}
      className={styles.engine}
    />
  )
}