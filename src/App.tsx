import './App.css'
import {useGamepadController} from "./hooks/gamepadControllerHook.ts";
import Menu from "./components/Menu/Menu.tsx";
import GameEngine from "./components/GameEngine/GameEngine.tsx";
import ControllerModal from "./components/Modal/ControllerModal.tsx";
import {useAppSelector} from "./store/store.ts";
import {MenuPages} from "./store/menuSlice.ts";
import RestHub from "./components/Hub/SmallHub/RestHub.tsx";
import PickItemHub from "./components/Hub/SmallHub/PickItemHub.tsx";
import MainHub from "./components/Hub/MainHub/MainHub.tsx";
import PermaHub from "./components/Hub/PermaHub/PermaHub.tsx";

function App() {
  const isControllerConnected = useAppSelector(state => state.gamepad.isConnected)
  const currentPage = useAppSelector(state => state.menu.currentPage)
  const isRestHub = useAppSelector(state => state.hub.isRestHub)
  const isPickHub = useAppSelector(state => state.hub.isPickHub)
  const isEqHub = useAppSelector(state => state.hub.isEqHub)

  useGamepadController()

  return (
    <>
      {!isControllerConnected && <ControllerModal/>}
      {currentPage !== MenuPages.NONE && <Menu/>}
      {isEqHub && <MainHub/>}
      {isRestHub && <RestHub/>}
      {isPickHub && <PickItemHub/>}
      {currentPage == MenuPages.NONE && <>
        <PermaHub/>
        <GameEngine/>
      </>}
    </>
  )
}

export default App
