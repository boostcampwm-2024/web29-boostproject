import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
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
