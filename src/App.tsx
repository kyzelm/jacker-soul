import './App.css'
import {useGamepadController} from "./hooks/gamepadControllerHook.ts";
import Menu from "./components/Menu/Menu.tsx";
import GameEngine from "./components/GameEngine/GameEngine.tsx";
import ControllerModal from "./components/Modal/ControllerModal.tsx";
import {useAppSelector} from "./store/store.ts";
import {MenuPages} from "./store/menuSlice.ts";
import RestHub from "./components/Hub/RestHub/RestHub.tsx";

function App() {
  const isControllerConnected = useAppSelector(state => state.gamepad.isConnected)
  const currentPage = useAppSelector(state => state.menu.currentPage)
  const isRestHub = useAppSelector(state => state.hub.isRestHub)

  useGamepadController()

  return (
    <>
      {!isControllerConnected && <ControllerModal/>}
      {currentPage !== MenuPages.NONE && <Menu/>}
      {isRestHub && <RestHub/>}
      {currentPage == MenuPages.NONE && <GameEngine/>}
    </>
  )
}

export default App
