import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// The reset and global variables moved to App.css,
// so index.css is optional. If it is empty, the line below can go.
// import './index.css';

// If you do not use reportWebVitals, that can go too, to tidy the code.
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// To measure performance:
// reportWebVitals();
