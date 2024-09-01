import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalContextProvider from "./Context/ContextApi";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <StrictMode.React>
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>

  // </StrictMode.React>
);
