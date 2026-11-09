import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./ThemeContext";
import { AnalyticsProvider, initMixpanel } from "./analytics";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tailwind.css";
import "./styles.css";

// Init before render so events fired from child mount effects aren't dropped.
initMixpanel("admin");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AnalyticsProvider platform="admin">
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AnalyticsProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
