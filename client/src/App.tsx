import { Route, Routes } from "react-router-dom";

import Root from './pages/root'
import Game from "./pages/game";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default App
