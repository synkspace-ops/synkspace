import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

function ensureRouteStyles() {
  if (document.getElementById("route-visibility-style")) return;

  const style = document.createElement("style");
  style.id = "route-visibility-style";
  style.textContent = `
    body.react-route-active > *:not(#root):not(script) {
      display: none !important;
    }
    body.react-route-active #root {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative;
      z-index: 2147483647;
    }
  `;
  document.head.appendChild(style);
}

function hideStaticContent() {
  const root = document.getElementById("root");
  if (!root) return;
  ensureRouteStyles();

  const isHome = window.location.pathname === "/";
  const staticElements = document.querySelectorAll(
    "body > *:not(#root):not(script)"
  );

  staticElements.forEach((el) => {
    el.style.display = isHome ? "" : "none";
  });

  if (isHome) {
    document.body.classList.remove("react-route-active");
    root.style.removeProperty("display");
    root.style.removeProperty("visibility");
    root.style.removeProperty("opacity");
    root.style.removeProperty("position");
    root.style.removeProperty("z-index");
  } else {
    document.body.classList.add("react-route-active");
    root.style.display = "block";
    root.style.visibility = "visible";
    root.style.opacity = "1";
    root.style.position = "relative";
    root.style.zIndex = "2147483647";
  }
}

function syncRouteView() {
  hideStaticContent();
  requestAnimationFrame(hideStaticContent);
  setTimeout(hideStaticContent, 0);
}

syncRouteView();

window.addEventListener("popstate", () => {
  syncRouteView();
});

const origPush = history.pushState.bind(history);
const origReplace = history.replaceState.bind(history);

history.pushState = (...args) => {
  origPush(...args);
  syncRouteView();
  window.dispatchEvent(new PopStateEvent("popstate"));
};

history.replaceState = (...args) => {
  origReplace(...args);
  syncRouteView();
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const root = createRoot(document.getElementById("root")!);

function renderApp() {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App key={window.location.pathname + window.location.search + window.location.hash} />
      </BrowserRouter>
    </StrictMode>
  );
}

window.addEventListener("popstate", () => {
  requestAnimationFrame(renderApp);
});

renderApp();
syncRouteView();
setInterval(() => {
  if (window.location.pathname !== "/") {
    hideStaticContent();
  }
}, 250);