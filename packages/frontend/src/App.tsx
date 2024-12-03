import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Editor from "./components/note/Editor.tsx";
import { PromptDialogPortal } from "./lib/prompt-dialog.tsx";
import Home from "./pages/Home.tsx";
import NotFoundPage from "./pages/NotFound.tsx";
import SpacePage from "./pages/Space.tsx";

function App() {
  return (
    <>
      <PromptDialogPortal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space/:spaceId" element={<SpacePage />} />
          <Route path="/note/:noteId" element={<Editor />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
