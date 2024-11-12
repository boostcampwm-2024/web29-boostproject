import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import SpacePage from "./pages/Space.tsx";
import PaletteMenu from "./components/space/PaletteMenu.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/space/:entrySpaceId" element={<SpacePage />} />
        <Route path="/palette" element={<PaletteMenu itemTypes={["note", "image", "link"]} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
