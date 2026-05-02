import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

function hideStaticContent() {
  const root = document.getElementById("root");
  if (!root) return;

  const isHome = window.location.pathname === "/";
  const staticElements = document.querySelectorAll(
    "body > *:not(#root):not(script)"
  );

  staticElements.forEach((el) => {
    (el as HTMLElement).style.display = isHome ? "" : "none";
  });
}

hideStaticContent();

window.addEventListener("popstate", () => {
  requestAnimationFrame(hideStaticContent);
});

const origPush = history.pushState.bind(history);
const origReplace = history.replaceState.bind(history);

history.pushState = (...args) => {
  origPush(...args);
  requestAnimationFrame(hideStaticContent);
};

history.replaceState = (...args) => {
  origReplace(...args);
  requestAnimationFrame(hideStaticContent);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);