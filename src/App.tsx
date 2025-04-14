import './App.css'
import {useGamepadController} from "./hooks/gamepadControllerHook.ts";
import Menu from "./components/Menu/Menu.tsx";
import GameEngine from "./components/GameEngine/GameEngine.tsx";
import ControllerModal from "./components/Modal/ControllerModal.tsx";
import {useAppSelector} from "./store/store.ts";
import {MenuPages} from "./store/menuSlice.ts";

function App() {
  const isControllerConnected = useAppSelector(state => state.gamepad.isConnected)
  const currentPage = useAppSelector(state => state.menu.currentPage)

  useGamepadController()

  return (
    <>
      {!isControllerConnected && <ControllerModal/>}
      {currentPage !== MenuPages.NONE && <Menu/>}
      <GameEngine/>
    </>
  )
}

export default App
