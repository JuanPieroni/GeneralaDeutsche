import React, { useState } from "react"
import "./Welcome.css"

const Welcome = ({ onEnter }) => {
    const [name, setName] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) return
        onEnter(trimmed)
    }

    return (
        <div className="welcome-overlay">
            <div className="welcome-box">
                <div className="welcome-eagle">🦅</div>
                <h1 className="welcome-title">GENERALA ALEMANA</h1>
                <p className="welcome-subtitle">Willkommen, Spieler</p>
                <form onSubmit={handleSubmit} className="welcome-form">
                    <input
                        className="welcome-input"
                        type="text"
                        placeholder="Ingresá tu nombre..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                        autoFocus
                    />
                    <button className="welcome-button" type="submit" disabled={!name.trim()}>
                        ⚔️ Entrar al juego
                    </button>
                </form>
                <div className="welcome-deco">🍺 🎲 🍺</div>
            </div>
        </div>
    )
}

export default Welcome
