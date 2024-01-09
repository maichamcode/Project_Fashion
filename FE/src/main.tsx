import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <IntlProvider locale="vi">
    <Provider store={store}>
      <App />
    </Provider>
  </IntlProvider>
);
