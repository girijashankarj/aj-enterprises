import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { store } from "./store";
import { App } from "./App";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter
          basename={
            import.meta.env.BASE_URL.replace(/\/$/, "") || undefined
          }
        >
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
