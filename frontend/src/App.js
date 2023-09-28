import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import CrearPublicacion from "./pages/CrearPublicacion/CrearPublicacion";
import FiltrarPublicacion from "./pages/FiltrarPublicacion/FiltrarPublicacion";
import Perfil from "./pages/Perfil/Perfil";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crear-publicacion" element={<CrearPublicacion />} />
          <Route path="/filtrar-publicaciones" element={<FiltrarPublicacion />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </Router>
  );
}

export default App;