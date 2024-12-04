import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/lib/polyfill-relative-urls-websocket.ts";

import App from "./App.tsx";
import "./index.css";

export default {};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
