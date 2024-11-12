import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import PaletteMenu from "./components/space/PaletteMenu.tsx";
import Home from "./pages/Home.tsx";
import SpacePage from "./pages/Space.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/space/:entrySpaceId" element={<SpacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
