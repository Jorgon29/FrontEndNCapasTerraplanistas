import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

const elem = document.getElementById("root")!;

createRoot(elem).render(<App />);