import { RouterProvider } from "@tanstack/react-router";
import DarkModeProvider from "designSystem/darkMode/DarkModeProvider";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { router } from "router";
import "styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <DarkModeProvider>
        <RouterProvider router={router} />
      </DarkModeProvider>
    </StrictMode>,
  );
}
