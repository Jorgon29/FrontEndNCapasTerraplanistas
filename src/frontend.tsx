import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

const elem = document.getElementById("root")!;

createRoot(elem).render(
  <StrictMode>
    <App />
  </StrictMode>
);