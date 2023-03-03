import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./i18n";
const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <Suspense fallback={<div>Loading... </div>}>
      <App />
    </Suspense>
  </BrowserRouter>,
  rootElement
);

registerServiceWorker();
