import './App.css'
import {useGamepadController} from "./hooks/gamepadControllerHook.ts";
import Menu from "./components/Menu/Menu.tsx";
import {useAppSelector} from "./store/store.ts";
import {MenuPages} from "./store/menuSlice.ts";
import GameEngine from "./components/GameEngine/GameEngine.tsx";

function App() {
  useGamepadController()

  const currentPage = useAppSelector(state => state.menu.currentPage)

  return (
    <>
      {currentPage !== MenuPages.NONE && <Menu/>}
      <GameEngine/>
    </>
  )
}

export default App
