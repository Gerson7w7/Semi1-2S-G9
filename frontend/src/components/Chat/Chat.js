import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.css";

const Chat = (props) => {
  //   const { user1, user2 } = props;
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socket = io("http://localhost:5000");

  const user1 = { id: "1", nombre: "Juan" };
  const user2 = { id: "2", nombre: "Duki" };
  const chatAux = [
    { userId: "1", text: "Hola" },
    { userId: "2", text: "Hola" },
    { userId: "1", text: "Como estas?" },
    { userId: "2", text: "Bien y tu?" },
    { userId: "1", text: "Bien" },
    { userId: "2", text: "Que haces?" },
    { userId: "1", text: "Nada y tu?" },
    { userId: "2", text: "Nada" },
    { userId: "1", text: "Ok" },
    { userId: "2", text: "Ok" },
    { userId: "1", text: "Adios" },
    { userId: "2", text: "Adios" },
  ];

  useEffect(() => {
    // Unirse a la sala correspondiente al chat entre user1 y user2
    socket.emit("joinRoom", { user1Id: user1.id, user2Id: user2.id });

    // Escuchar el evento 'message' del servidor
    socket.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    // Limpiar la conexión cuando el componente se desmonta
    return () => {
      socket.disconnect();
    };
  }, [user1.id, user2.id]); // Dependencias actualizadas

  const sendMessage = () => {
    // Enviar el mensaje al servidor
    let data = {
      id_usuario1: user1.id,
      id_usuario2: user2.id,
      mensaje: newMessage
    };
    console.log("data: ", data);
    socket.emit("message", data);
    // Limpiar el área de texto
    setNewMessage("");
  };

  return (
    <main>
      <h5>{user2.nombre}</h5>
      <div className="chat-container">
        {chatAux.map((message, index) => (
          <div
            key={index}
            className={`message ${
              Number(message.userId) === Number(user1.id) ? "right" : "left"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          className="textarea-chat"
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="button-enviar" onClick={sendMessage}>
          <h5>{">"}</h5>
        </button>
      </div>
    </main>
  );
};

export default Chat;
