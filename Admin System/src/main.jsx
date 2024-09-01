import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import GlobalContextProvider from "./Context/ContextApi.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  //   <GlobalContextProvider>
  //     <App />
  //   </GlobalContextProvider>
  // </Provider>
  <GlobalContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </GlobalContextProvider>
);

{
  /* <GlobalContext>
  <Provider store={store}>
    <App />
  </Provider>
</GlobalContext>; */
}
