import React from "react";
import Navegacion from "../../components/Navegacion/Navegacion";
import "./FiltrarPublicacion.css";
import { useState } from "react";
import { Box, Grid } from "@mui/material";

const FiltrarPublicacion = () => {
  const [etiquetas, setEtiquetas] = useState(["Todos"]);
  const [selecEtiqueta, setSelectEtiqueta] = useState("");
  const [buscarEtiqueta, setBuscarEtiqueta] = useState("");
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  const buscarFn = () => {
    const url = `${ip}/buscar`;
    const fetchData = async () => {
      let data = {
        // buscar: buscar,
        id_usuario: localStorage.getItem("id_usuario"),
      };
      console.log("datos enviados:", data);
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
          console.log("respuesta: ", res);
        });
    };
    fetchData();
  };

  const filtrarPublicaciones = () => {
    console.log("selec: ", selecEtiqueta);
    console.log("buscar: ", buscarEtiqueta);
  }

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
      </div>
    </main>
  );
};

export default FiltrarPublicacion;
