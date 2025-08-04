import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { SocketProvider } from "./components/SocketContext"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
)