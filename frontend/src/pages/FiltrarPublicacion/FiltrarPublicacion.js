import React, { useEffect } from "react";
import Navegacion from "../../components/Navegacion/Navegacion";
import "./FiltrarPublicacion.css";
import { useState } from "react";
import { Box, Grid } from "@mui/material";
import Publicacion from "../../components/Publicacion/Publicacion";

const FiltrarPublicacion = () => {
  const [etiquetas, setEtiquetas] = useState(["Todos"]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [selecEtiqueta, setSelectEtiqueta] = useState("Todos");
  const [buscarEtiqueta, setBuscarEtiqueta] = useState("");
  const ip = "http://localhost:5000";

  useEffect(() => {
    const url = `${ip}/get-etiquetas`;
    let data = { id_usuario: localStorage.getItem("id_usuario") };
    console.log("data: ", data);

    const fetchData = async () => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          setEtiquetas(res.etiquetas);
          setPublicaciones(res.publicaciones);
        });
    };
    fetchData();
  }, []);

  const filtrarPublicaciones = () => {
    const url = `${ip}/filtrar-publicaciones`;
    let data = {
      etiqueta: buscarEtiqueta === '' ? selecEtiqueta : buscarEtiqueta,
      id_usuario: localStorage.getItem("id_usuario"),
    };
    console.log("data: ", data);
    const fetchData = async () => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          setEtiquetas(res.etiquetas);
          setPublicaciones(res.publicaciones);
        });
    };
    fetchData();
  };

  return (
    <main>
      <Navegacion />

      <div class="contenido album py-5 ">
        <div class="container">
          <h1>Filtrar Publicaiones</h1>
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <Grid xs={2}>
                <div class="form-group">
                  <label for="exampleSelect1" class="form-label selec-filtro">
                    Etiquetas
                  </label>
                  <select
                    class="form-select"
                    id="exampleSelect1"
                    onChange={(event) => setSelectEtiqueta(event.target.value)}
                  >
                    {etiquetas.map((e) => (
                      <option value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </Grid>
              <Grid xs={3}>
                <div class="form-group">
                  <label class="col-form-label mt-4" for="inputDefault">
                    Buscar etiqueta
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Todos..."
                    id="inputDefault"
                    onChange={(event) => setBuscarEtiqueta(event.target.value)}
                  />
                </div>
              </Grid>
              <Grid xs={4}>
                <div class="form-group">
                  <button
                    type="button"
                    class="btn btn-success boton-filtro"
                    onClick={filtrarPublicaciones}
                  >
                    Filtrar
                  </button>
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
        {publicaciones.map((p) => (
          <Publicacion
            usuario={p.usuario}
            fecha={p.fecha}
            imagen={p.imagen}
            descripcion={p.descripcion}
            comentarios={p.comentarios}
          />
        ))}
        {/* <Publicacion /> */}
      </div>
    </main>
  );
};

export default FiltrarPublicacion;