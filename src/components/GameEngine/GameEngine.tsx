import {JSX, useEffect, useRef} from "react";
import SceneComponent from "babylonjs-hook";
import {DualShockButton, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3} from "@babylonjs/core";
import styles from "./GameEngine.module.css";
import {useAppSelector} from "../../store/store.ts";

export default function GameEngine(): JSX.Element {
  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown)

  const box = useRef<Mesh>(null);

  useEffect(() => {
    if (buttonDown.includes(DualShockButton.Cross)) {
      box.current!.position.y += 1
    }
  }, [buttonDown]);

  const onSceneReady = (scene: Scene) => {
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());

    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    box.current = MeshBuilder.CreateBox("box", {size: 2}, scene);
    box.current.position.y = 1;

    MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
  };

  const onRender = () => {
    if (box.current) {
      box.current.rotation.y += 0.01;
    }
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