import {JSX, useEffect, useRef} from "react";
import {
  ActionManager,
  Color3,
  Engine,
  ExecuteCodeAction,
  FollowCamera,
  HavokPlugin,
  ImportMeshAsync,
  ISceneLoaderAsyncResult,
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsCharacterController,
  PhysicsShapeType,
  PointLight,
  Scene,
  ShadowGenerator,
  Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders";
import HavokPhysics from "@babylonjs/havok";
import styles from "./GameEngine.module.css"
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {GamepadActions} from "../../store/gamepadSlice.ts";
import {MenuPages} from "../../store/menuSlice.ts";
import {HubActions} from "../../store/hubSlice.ts";

enum PlayerAnimation {
  HEAVY_ATTACK = 0,
  IDLE = 1,
  JUMP = 2,
  LIGHT_ATTACK = 3,
  ROLL = 4,
  RUN = 5,
  WALK = 6,
}

enum PlayerState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  JUMPING = "JUMPING",
  ROLLING = "ROLLING",
  LIGHT_ATTACK = "LIGHT_ATTACK",
  HEAVY_ATTACK = "HEAVY_ATTACK",
  WALKING = "WALKING",
}

export default function GameEngine(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cameraRef = useRef<FollowCamera>(null);
  const playerRef = useRef<{
    playerController?: PhysicsCharacterController,
    playerHitbox?: Mesh,
    playerModel?: ISceneLoaderAsyncResult,
    movement: Vector3,
    rotation: Vector3,
    state: PlayerState,
  }>({
    movement: new Vector3(0, -9.81, 0),
    rotation: new Vector3(0, 0, 0),
    state: PlayerState.IDLE,
  });
  const mapRef = useRef<ISceneLoaderAsyncResult>(null);

  const dispatch = useAppDispatch();

  const menuPage = useAppSelector(state => state.menu.currentPage)
  const menuPageRef = useRef(MenuPages.HOME);

  const playerState = useAppSelector(state => state.player.playerStats);

  const buttonDown = useAppSelector(state => state.gamepad.buttonsDown)
  const constrols = useAppSelector(state => state.gamepad.controls)

  const leftAxis = useAppSelector(state => state.gamepad.axis)[0]
  const leftAxisRef = useRef<[number, number]>([0, 0])

  const rightAxis = useAppSelector(state => state.gamepad.axis)[1]
  const rightAxisRef = useRef<[number, number]>([0, 0])

  function isAnimationPlaying(): boolean {
    return playerRef.current.playerModel!.animationGroups.some((group) => group.isPlaying && group.name !== "idle" && group.name !== "run" && group.name !== "walk");
  }

  function stopAnimation(): void {
    playerRef.current.playerModel!.animationGroups.forEach((group) => {
      group.stop();
    });
  }

  useEffect(() => {
    menuPageRef.current = menuPage;
  }, [menuPage]);

  useEffect(() => {
    if (menuPageRef.current !== MenuPages.NONE) return;

    if (buttonDown === constrols.ROLL && !isAnimationPlaying()) {
      stopAnimation();
      playerRef.current.playerModel!.animationGroups[PlayerAnimation.ROLL].start(false);
      playerRef.current.state = PlayerState.ROLLING;
    }

    if (buttonDown === constrols.JUMP && !isAnimationPlaying()) {
      playerRef.current.movement.y = 5;
      stopAnimation();
      playerRef.current.playerModel!.animationGroups[PlayerAnimation.JUMP].start(false);
      playerRef.current.state = PlayerState.JUMPING;
    }

    if (buttonDown === constrols.RUN && !isAnimationPlaying() && playerRef.current.state !== PlayerState.RUNNING) {
      stopAnimation();
      playerRef.current.playerModel!.animationGroups[PlayerAnimation.RUN].start(true);
      playerRef.current.state = PlayerState.RUNNING;
    }

    if (buttonDown === constrols.LIGHT_ATTACK && !isAnimationPlaying()) {
      stopAnimation();
      playerRef.current.playerModel!.animationGroups[PlayerAnimation.LIGHT_ATTACK].start(false, playerState.type === "fast" ? 1.5 : 1.0);
      playerRef.current.state = PlayerState.LIGHT_ATTACK;
    }

    if (buttonDown === constrols.HEAVY_ATTACK && !isAnimationPlaying()) {
      stopAnimation();
      playerRef.current.playerModel!.animationGroups[PlayerAnimation.HEAVY_ATTACK].start(false, playerState.type === "fast" ? 1.5 : 1.0);
      playerRef.current.state = PlayerState.HEAVY_ATTACK;
    }

    dispatch(GamepadActions.buttonExecuted());
  }, [buttonDown, constrols.HEAVY_ATTACK, constrols.JUMP, constrols.LIGHT_ATTACK, constrols.ROLL, constrols.RUN, dispatch, playerState.type]);

  useEffect(() => {
    if (menuPageRef.current !== MenuPages.NONE) return;

    leftAxisRef.current[0] = leftAxis.x
    leftAxisRef.current[1] = leftAxis.y
  }, [leftAxis]);

  useEffect(() => {
    if (menuPageRef.current !== MenuPages.NONE) return;

    rightAxisRef.current[0] = rightAxis.x
    rightAxisRef.current[1] = rightAxis.y
  }, [rightAxis]);

  async function SceneSetup(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);

    const camera = new FollowCamera("followCamera", new Vector3(0, 0, 0), scene);
    camera.radius = 6;
    camera.heightOffset = 2;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 10;

    const shadowGenerators: ShadowGenerator[] = [];

    const map = await ImportMeshAsync("/models/level.glb", scene);
    map.meshes.forEach((mesh) => {
      if (mesh.parent) {
        mesh.computeWorldMatrix();
        mesh.parent = null;
      }
      mesh.isPickable = false;
      mesh.checkCollisions = true;
      mesh.receiveShadows = true;
      if (mesh.name.startsWith("Light")) {
        const light = new PointLight(mesh.name, mesh.position, scene);
        light.intensity = 2;
        light.diffuse = new Color3(255, 255, 150);
        light.specular = new Color3(255, 255, 150);

        shadowGenerators.push(new ShadowGenerator(1024, light));
      }
      if (mesh.name.startsWith("Crystal")) {
        const light = new PointLight(mesh.name, mesh.position, scene);
        light.intensity = 0.5;
        light.diffuse = new Color3(0, 200, 200);
        light.specular = new Color3(0, 200, 200);

        shadowGenerators.push(new ShadowGenerator(1024, light));
      }
    });

    const playerHitbox = MeshBuilder.CreateCapsule("player", {
      height: 1.7,
      radius: 0.4,
    }, scene);
    playerHitbox.visibility = 0;
    camera.lockedTarget = playerHitbox;

    const playerModel = await ImportMeshAsync( `/models/player${playerState.type === "fast" ? "L" : "H"}.glb`, scene);
    playerModel.meshes[0].parent = playerHitbox;
    playerModel.meshes[0].position.y = -0.95;
    playerModel.animationGroups[0].stop();
    playerModel.animationGroups[PlayerAnimation.IDLE].start(true);
    shadowGenerators.forEach(shadowGenerator => {
      playerModel.meshes.forEach((mesh) => {
        shadowGenerator.addShadowCaster(mesh);
      })
    })

    const hp = await HavokPhysics({
      locateFile() {
        return "/node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm";
      }
    });

    scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, hp));

    map.meshes.forEach((mesh) => {
      if (mesh.name.startsWith("Collision")) {
        new PhysicsAggregate(mesh, PhysicsShapeType.BOX, {
          mass: 0,
          restitution: 0,
        }, scene);
      }
      if (mesh.name.startsWith("Fog")) {
        mesh.visibility = 0;
        mesh.isPickable = false;
        mesh.checkCollisions = false;
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(
          new ExecuteCodeAction({
            trigger: ActionManager.OnIntersectionExitTrigger,
            parameter: playerHitbox,
          }, () => {
            if (playerHitbox.position.z < mesh.position.z) {
              mesh.visibility = 1;
              new PhysicsAggregate(mesh, PhysicsShapeType.BOX, {
                mass: 0,
                restitution: 0,
              }, scene);
            }
          })
        )
      }
      if (mesh.name.startsWith("Crystal")) {
        const detector = MeshBuilder.CreateSphere("detector", {
          diameter: 20,
          segments: 4,
        })
        detector.parent = mesh;
        detector.isPickable = false;
        detector.checkCollisions = true;
        detector.isVisible = false;
        detector.actionManager = new ActionManager(scene);
        detector.actionManager.registerAction(
          new ExecuteCodeAction({
            trigger: ActionManager.OnIntersectionEnterTrigger,
            parameter: playerHitbox,
          }, () => {
            dispatch(HubActions.openRestHub(parseFloat(mesh.name.split("-")[1])));
          })
        )
        detector.actionManager.registerAction(
          new ExecuteCodeAction({
            trigger: ActionManager.OnIntersectionExitTrigger,
            parameter: playerHitbox,
          }, () => {
            dispatch(HubActions.closeRestHub());
          })
        )
      }
    })

    const playerController = new PhysicsCharacterController(new Vector3(0, 5, 0), {
      capsuleHeight: 1.7,
      capsuleRadius: 0.4,
    }, scene);
    playerController.setPosition(map.meshes!.find((mesh) => mesh.name.startsWith("Crystal") && parseFloat(mesh.name.split("-")[1]) === playerState.spawn)!.getAbsolutePosition().add(new Vector3(0, 0.55, 0)));

    cameraRef.current = camera;
    playerRef.current.playerController = playerController;
    playerRef.current.playerHitbox = playerHitbox;
    playerRef.current.playerModel = playerModel;
    mapRef.current = map;

    return scene;
  }

  function updatePlayerVelocity(): void {
    if (playerRef.current.playerModel!.animationGroups[PlayerAnimation.HEAVY_ATTACK].isPlaying || playerRef.current.playerModel!.animationGroups[PlayerAnimation.LIGHT_ATTACK].isPlaying) {
      playerRef.current.movement = playerRef.current.movement.scale(0.001);
      return;
    }

    const rotationOffsetRad = cameraRef.current!.rotationOffset * (Math.PI / 180);

    const forward = new Vector3(Math.sin(rotationOffsetRad), 0, Math.cos(rotationOffsetRad));
    const right = new Vector3(Math.cos(rotationOffsetRad), 0, -Math.sin(rotationOffsetRad));

    forward.normalize();
    right.normalize();

    const forwardVelocity = forward.scale(leftAxisRef.current[1] * (playerRef.current.state === PlayerState.RUNNING ? 9 : 4));
    const rightVelocity = right.scale(-leftAxisRef.current[0] * (playerRef.current.state === PlayerState.RUNNING ? 9 : 4));

    if (playerRef.current.movement.y > -9.81) {
      playerRef.current.movement.y -= 0.4;
    }

    playerRef.current.movement = new Vector3(
      forwardVelocity.x + rightVelocity.x,
      playerRef.current.movement.y,
      forwardVelocity.z + rightVelocity.z
    )
  }

  const onRender = (scene: Scene) => {
    if (!playerRef.current.playerController || !playerRef.current.playerHitbox || !cameraRef.current) return;
    if (menuPageRef.current !== MenuPages.NONE) return;

    cameraRef.current.rotationOffset += rightAxisRef.current[0] * 3;
    if (cameraRef.current.rotationOffset > 360) {
      cameraRef.current.rotationOffset -= 360;
    }
    if (cameraRef.current.rotationOffset < 0) {
      cameraRef.current.rotationOffset += 360;
    }

    cameraRef.current.heightOffset += rightAxisRef.current[1] * 0.1;
    if (cameraRef.current.heightOffset > 5) {
      cameraRef.current.heightOffset = 5;
    }
    if (cameraRef.current.heightOffset < 0) {
      cameraRef.current.heightOffset = 0;
    }

    const downVector = new Vector3(0, -1, 0);
    const characterGravity = new Vector3(0, -9.81, 0);

    const support = playerRef.current.playerController.checkSupport(scene.deltaTime / 1000.0, downVector);
    updatePlayerVelocity();
    playerRef.current.playerController.setVelocity(playerRef.current.movement);
    playerRef.current.playerController.integrate(scene.deltaTime / 1000.0, support, characterGravity);
    playerRef.current.playerHitbox.position = playerRef.current.playerController.getPosition();

    if (leftAxisRef.current[0] > 0.1 || leftAxisRef.current[0] < -0.1 || leftAxisRef.current[1] > 0.1 || leftAxisRef.current[1] < -0.1) {
      playerRef.current.playerModel!.meshes.forEach((mesh) => {
        mesh.rotation.z = Math.atan2(playerRef.current.movement.x, playerRef.current.movement.z);
      })
      if (playerRef.current.state !== PlayerState.RUNNING && playerRef.current.state !== PlayerState.WALKING && !isAnimationPlaying()) {
        stopAnimation();
        playerRef.current.playerModel!.animationGroups[PlayerAnimation.WALK].start(true);
        playerRef.current.state = PlayerState.WALKING;
      }
    } else {
      if (playerRef.current.state !== PlayerState.IDLE && !isAnimationPlaying()) {
        stopAnimation();
        playerRef.current.playerModel!.animationGroups[PlayerAnimation.IDLE].start(true);
        playerRef.current.state = PlayerState.IDLE;
      }
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    })

    engine.displayLoadingUI();

    SceneSetup(engine).then((scene) => {
      engine.hideLoadingUI()
      engine.runRenderLoop(() => {
        if (scene) {
          onRender(scene);
          scene.render();
        }
      })
    }).catch((err) => {
      console.error("Error setting up scene:", err);
    })

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
      window.removeEventListener("resize", () => {
        engine.resize();
      })
    }
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.engine}></canvas>
  )
}