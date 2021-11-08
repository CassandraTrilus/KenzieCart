import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import { AppRouter } from "AppRouter";
import { ManagedUIContext } from "hooks/useUI";
import { ManagedUICurrencyContext } from "hooks/useCurrency";
import { ProvideCart } from "hooks/useCart";
import reportWebVitals from "reportWebVitals";
import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <ManagedUICurrencyContext>
      <ManagedUIContext>
        <ProvideCart>
          <AppRouter>
            <App />
          </AppRouter>
        </ProvideCart>
      </ManagedUIContext>
    </ManagedUICurrencyContext>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
