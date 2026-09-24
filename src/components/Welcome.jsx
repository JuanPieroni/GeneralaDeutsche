import React, { useState, useRef, useEffect } from "react"
import "./Welcome.css"

const Welcome = ({ onEnter }) => {
    const [name, setName] = useState("")
    const [muted, setMuted] = useState(false)
    const audioRef = useRef(null)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.15
            audioRef.current.play().catch(() => {})
        }
    }, [])

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !muted
        }
        setMuted(!muted)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) return
        onEnter(trimmed)
    }

    return (
        <div className="welcome-overlay">
            <video
                className="welcome-video-bg"
                src="/german-animation-gif-download-5188031.mp4"
                autoPlay
                muted
                playsInline
            />
            <div className="welcome-video-overlay" />

            <audio ref={audioRef} src="/estate.mp3" loop />

            <button className="welcome-mute-btn" onClick={toggleMute} title={muted ? "Activar música" : "Silenciar"}>
                {muted ? "🔇" : "🔊"}
            </button>

            <div className="welcome-box">
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
