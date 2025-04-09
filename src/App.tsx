import './App.css'
import {useGamepadController} from "./hooks/gamepadControllerHook.ts";

function App() {
  const [isGamepadConnected, buttonsPressed, axis] = useGamepadController()

  return (
    <>
      <div className="App">
        <h1>Gamepad Connection Status</h1>
        {isGamepadConnected ? (
          <p>Gamepad is connected!</p>
        ) : (
          <p>No gamepad connected.</p>
        )}
        <h2>Buttons Pressed</h2>
        {buttonsPressed}
        <h2>Axis Values</h2>
        {axis.map((stick, index) => (
          <div key={index}>
            <h3>Stick {index + 1}</h3>
            <p>X: {stick.x}</p>
            <p>Y: {stick.y}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
