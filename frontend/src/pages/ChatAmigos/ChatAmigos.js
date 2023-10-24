import React, { useEffect, useState } from "react";
import Navegacion from "../../components/Navegacion/Navegacion";
import "./ChatAmigos.css";
import Chat from "../../components/Chat/Chat";

const ChatAmigos = () => {
  const [amigos, setAmigos] = useState([]);
  const [user1, setUser1] = useState({ id: "", nombre: "" });
  const [user2, setUser2] = useState({ id: "", nombre: "" });
  const [showChat, setShowChat] = useState(false);

  const ip = "http://localhost:5000";

  useEffect(() => {
    const url = `${ip}/agg-sl-friends`;
    const token = localStorage.getItem("jwt");

    const fetchData = async () => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          setAmigos(res.mis_friends);
          setUser1({ id: res.userid, nombre: res.nombre });
        });
    };
    fetchData();
  }, []);

  const chatear = (id_usuario2, nombre2) => {
    setUser2({ id: id_usuario2, nombre: nombre2 });
    setShowChat(true);
  };

  return (
    <main>
      <Navegacion />
      <div className="contenido album contenido-amigos">
        <div className="cards-container">
          <div className="cards-inner-container">
            <div class="card">
              <img
                src="https://viapais.com.ar/resizer/MddKMHve-vqiG0CWdOn1NSSULUs=/980x640/smart/filters:quality(75):format(webp)/cloudfront-us-east-1.images.arcpublishing.com/grupoclarin/F46KZJQDZNHMDIHW67ZTJBL32Y.jpg"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">Duki</h5>
                <button type="button" class="btn btn-info">
                  Enviar mensaje
                </button>
              </div>
            </div>
            {amigos.map((a) => (
              <div class="card">
                <img src={a.imagen} class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">{a.nombre}</h5>
                  <button
                    type="button"
                    class="btn btn-info"
                    onClick={() => chatear(a.id, a.nombre)}
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Chat />
        {/* {showChat ? <Chat user1={user1} user2={user2} /> : <div></div>} */}
      </div>
    </main>
  );
};

export default ChatAmigos;
