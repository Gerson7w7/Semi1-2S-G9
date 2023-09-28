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

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crear-publicacion" element={<CrearPublicacion />} />
          <Route path="/filtrar-publicaciones" element={<FiltrarPublicacion />} />
        </Routes>
      </Router>
  );
}

export default App;