import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { ThemeProvider } from "./ThemeContext";
import { AnalyticsProvider } from "./analytics";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tailwind.css";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AnalyticsProvider platform="admin">
          <App />
        </AnalyticsProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
