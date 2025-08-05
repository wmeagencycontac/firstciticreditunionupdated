import "./global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Prevent multiple root creation during development hot reload
let root = (window as any).__react_root__;

if (!root) {
  root = createRoot(container);
  if (process.env.NODE_ENV === "development") {
    (window as any).__react_root__ = root;
  }
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
