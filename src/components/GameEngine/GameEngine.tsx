import {JSX, useEffect, useRef} from "react";
import {
  Engine,
  FreeCamera,
  HavokPlugin,
  HemisphericLight, ImportMeshAsync, ISceneLoaderAsyncResult, Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
  Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders";
import HavokPhysics from "@babylonjs/havok";
import styles from "./GameEngine.module.css"

export default function GameEngine(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cameraRef = useRef<FreeCamera>(null);
  const boxRef = useRef<Mesh>(null);
  const mapRef = useRef<ISceneLoaderAsyncResult>(null);

  async function SceneSetup(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);

    const camera = new FreeCamera("cam", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvasRef.current, true);
    cameraRef.current = camera;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const map = await ImportMeshAsync("/models/level.glb", scene);
    map.meshes.forEach((mesh) => {
      if (mesh.parent) {
        mesh.computeWorldMatrix();
        mesh.parent = null;
      }
      mesh.isPickable = false;
      mesh.checkCollisions = true;
    });

    const box = MeshBuilder.CreateBox("box", {size: 1}, scene);
    box.position = new Vector3(0, 5, 0);

    const hp = await HavokPhysics({
      locateFile() {
        return "/node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm";
      }
    });

    scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, hp));

    new PhysicsAggregate(box, PhysicsShapeType.BOX, {
      mass: 1,
      restitution: 0,
    }, scene);

    map.meshes.forEach((mesh) => {
      new PhysicsAggregate(mesh, PhysicsShapeType.BOX, {
        mass: 0,
        restitution: 0,
      }, scene);
    })

    boxRef.current = box;
    mapRef.current = map;

    return scene;
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    })

    SceneSetup(engine).then((scene) => {
      engine.runRenderLoop(() => {
        if (scene) {
          scene.render();
        }
      })
    }).catch((err) => {
      console.error("Error setting up scene:", err);
    })
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.engine}></canvas>
  )
}