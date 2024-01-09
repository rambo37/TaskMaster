import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/App.css";
import "./styles/Form.css";
import "./styles/Settings.css";
import "./styles/TaskPage.css";
import "./styles/TaskList.css";
import "./styles/TaskCard.css";
import "./styles/Legend.css";
import "./styles/TaskListSettings.css";
import "./styles/TaskListOptions.css";
import "./styles/TaskListSortingControls.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
