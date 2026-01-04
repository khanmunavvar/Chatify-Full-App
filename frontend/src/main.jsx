import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider"; // <--- 1. Import kiya

ReactDOM.createRoot(document.getElementById("root")).render(
  // 2. ChatProvider ko BrowserRouter ke andar lagaya
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);