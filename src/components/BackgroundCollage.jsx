// 🔵 Imports
import React from "react"
import "./BackgroundCollage.css"

// 🟡 Componente
export default function BackgroundCollage() {
    const images = [
      "/img/acade.jpg",
      "/img/acade2.jpeg",
        "/img/diego.jpg",
        "/img/copa.png",
        "/img/banderaflameando.webp",
        "/img/oktober.webp",
        "/img/muller.webp",
        "/img/sorteo.jpg",
        "/img/sensini-voller.jpg",
        "/img/gif.gif",
        "/img/gif2.gif",
        "/img/salchichas.jpg",
        "/img/penal.jpg",
        "/img/hitler.jpg",
        "/img/diegollora.jpg",
        "/img/dance.jpg",
        "/img/chin.webp",
        "/img/bayern.jpg",
    ]

return (
    <div className="background-collage">
      {images.map((src, i) => (
        <div
          key={src}
          className="bg-image"
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}
