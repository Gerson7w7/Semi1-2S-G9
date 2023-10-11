import React, { useState } from "react";
import "../Publicacion/Publicacion.css";


const Publicacion = (props) => {
  const { id_publicacion, nombre, fecha, imagen, descripcion, comentarios } = props;
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState({ id_publicacion, nombre, contenido: "" });
  const [comentarios2, setComentarios] = useState(comentarios);

     

  const toggleComentarios = () => {
    setMostrarComentarios(!mostrarComentarios);
  };

  const handleNuevoComentarioChange = (event) => {
    setNuevoComentario({ ...nuevoComentario, contenido: event.target.value });
  };

  const ip = "http://localhost:5000";
  let data = {
    comentario: nuevoComentario.contenido,
    id_publicacion,
    nombre

  }

  const enviarComentario = async () => {
    if (nuevoComentario.contenido.trim() !== "") {
      try {
        console.log(data)
        const token = localStorage.getItem("jwt");
        const response = await fetch(`${ip}/add-comentario`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const data = await response.json();
          const nuevoComentario = {
            nombre,
            contenido: nuevoComentario.contenido,
          };
          setComentarios([...comentarios, nuevoComentario]);
          setNuevoComentario({ nombre: "", contenido: "" });
        } else {
          
          alert("Error al enviar el comentario");
        }
      } catch (error) {
        alert("Error al realizar la solicitud:", error);
      }
    }
  };


  
  return (
    <main>
      <div className="post-container">
        <div className="header">
          <img
            src={imagen}
            alt="Publicacion"
            className="post-image"
            style={{ maxWidth: "100%" }}
          />
          <div className="header-text">
            <div className="header-background">
              <p className="name">{nombre}</p>
              <p className="date">{fecha}</p>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="content-background">
            <p className="description">{descripcion}</p>
          </div>
        </div>
        <div className="comentarios-container">
          <button className="ver-comentarios-btn" onClick={toggleComentarios}>
            {mostrarComentarios ? "Ocultar Comentarios" : "Ver Comentarios"}
          </button>
          {mostrarComentarios && (
            <div className="comentarios-section">
              <ul className="comentarios-list">
                {comentarios2.map((comentario, index) => (
                  <li key={index}>
                    <strong>{comentario.nombre}:</strong> {comentario.contenido}
                  </li>
                ))}
              </ul>
              <textarea
                placeholder="Escribe tu comentario..."
                value={nuevoComentario.contenido}
                onChange={handleNuevoComentarioChange}
                className="nuevo-comentario-input"
              />
              <button onClick={enviarComentario} className="enviar-comentario-btn">
                Enviar Comentario
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Publicacion;
