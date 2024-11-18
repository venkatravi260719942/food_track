// import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import "./i18n";
import { LanguageProvider } from "./LanguageContext";
// import { LanguageContext } from "./LanguageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.Suspense fallback="loading...">
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.Suspense>
);
