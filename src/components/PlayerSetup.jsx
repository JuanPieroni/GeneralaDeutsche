import React, { useState } from "react"

const PlayerSetup = ({ onPlayerSet }) => {
    const [name, setName] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (name.trim()) {
            onPlayerSet(name.trim())
        }
    }

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "100vh",
            background: "rgba(0,0,0,0.8)",
            color: "white"
        }}>
            <h2>Ingresa tu nombre</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre..."
                    style={{ padding: "10px", fontSize: "16px" }}
                    autoFocus
                />
                <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
                    Entrar
                </button>
            </form>
        </div>
    )
}

export default PlayerSetup