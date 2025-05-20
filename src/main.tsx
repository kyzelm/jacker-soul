import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store/store.ts";

const ambientAudio = new Audio("/sounds/ambient-music.mp3");
ambientAudio.play().then(() =>
  console.log("Ambient music started playing"));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </StrictMode>,
)
