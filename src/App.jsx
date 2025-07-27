import { useState } from "react"
import Board from "./components/Board.jsx"
import "./App.css"
import Chat from "./components/Chat.jsx"

function App() {
    return (
        <>
            <h1>GENERALA ALEMANA</h1>
            <Board />
            <Chat />
        </>
    )
}

export default App
