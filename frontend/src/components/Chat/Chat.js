import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Chat.css";

const URL = "wss://vk7tl0t2b0.execute-api.us-east-1.amazonaws.com/production";

const Chat = (props) => {
  const { user1, user2 } = props;
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  // const user1 = { id: "1", nombre: "Juan" };
  // const user2 = { id: "2", nombre: "Duki" };
  // const chatAux = [
  //   { userId: "1", text: "Hola" },
  //   { userId: "2", text: "Hola" },
  //   { userId: "1", text: "Como estas?" },
  //   { userId: "2", text: "Bien y tu?" },
  //   { userId: "1", text: "Bien" },
  //   { userId: "2", text: "Que haces?" },
  //   { userId: "1", text: "Nada y tu?" },
  //   { userId: "2", text: "Nada" },
  //   { userId: "1", text: "Ok" },
  //   { userId: "2", text: "Ok" },
  //   { userId: "1", text: "Adios" },
  //   { userId: "2", text: "Adios" },
  // ];

  const onSocketOpen = useCallback(() => {
    socket.current?.send(JSON.stringify({ action: "setRoom", user1, user2 }));
  }, [user1, user2]);

  const onSocketMessage = useCallback((dataSTR) => {
    const data = JSON.parse(dataSTR);
    setChat(data.historial);
  }, []);

  const onSocketClose = useCallback(() => {
    console.log("Desconectado");
  }, []);

  const onSendMessage = useCallback((message, user2) => {
    socket.current?.send(JSON.stringify({ action: "sendMessage", message, user2 }));
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState === socket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
      socket.current.addEventListener("close", onSocketClose);
      console.log("Conectado");
    }
  }, []);

  useEffect(() => {
    onConnect();
    return () => {
      if (socket.current?.readyState === socket.OPEN) {
        socket.current.close();
      }
    };
  }, [onConnect]); // Dependencias actualizadas

  const sendMessage = () => {
    // Enviar el mensaje al servidor;
    onSendMessage(newMessage, user2)
    // Limpiar el área de texto
    setNewMessage("");
  };

  return (
    <main>
      <h5>{user2.nombre}</h5>
      <div className="chat-container">
        {chat.map((message, index) => (
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
