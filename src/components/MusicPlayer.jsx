import React, { useRef, useEffect, useState } from "react"
import { useSocket } from "./SocketContext"

const MusicPlayer = () => {
    const socket = useSocket()
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)

    useEffect(() => {
        if (!socket) return

        const handleGameState = (gameState) => {
            if (gameState.music) {
                setIsPlaying(gameState.music.isPlaying)
                if (audioRef.current) {
                    if (gameState.music.isPlaying) {
                        audioRef.current.play()
                    } else {
                        audioRef.current.pause()
                    }
                }
            }
        }

        const handleMusicUpdate = (musicState) => {
            setIsPlaying(musicState.isPlaying)
            if (audioRef.current) {
                if (musicState.isPlaying) {
                    audioRef.current.play()
                } else {
                    audioRef.current.pause()
                }
            }
        }

        socket.on("game-state", handleGameState)
        socket.on("update-music", handleMusicUpdate)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("update-music", handleMusicUpdate)
        }
    }, [socket])

    const toggleMusic = () => {
        const newState = !isPlaying
        setIsPlaying(newState)
        socket.emit("update-music", { isPlaying: newState })
    }

    const changeVolume = (newVolume) => {
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    return (
        <div style={{ padding: "10px", border: "1px solid #ccc", margin: "10px" }}>
            <audio ref={audioRef} loop>
                <source src="/music.mp3" type="audio/mpeg" />
            </audio>
            <h4>Música</h4>
            <button onClick={toggleMusic}>
                {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
            </button>
            <div style={{ marginTop: "10px" }}>
                <label>Volumen: </label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                />
                <span>{Math.round(volume * 100)}%</span>
            </div>
        </div>
    )
}

export default MusicPlayer