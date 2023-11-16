/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Inicio } from "./components/Inicio";
import ProveedoresPage from "./pages/ProveedoresPage";
import { TablaInsumosPage } from "./pages/TablaInsumosPage";
import AltaInsumosPage from "./pages/AltaInsumosPage";
import { AltaProvPage } from './pages/AltaProvPage';
import { TablaEntradasPage } from "./pages/TablaEntradasPage";
import { RegistroEntradaForm } from "./pages/RegistroEntradaPage";
import { TablaSalida } from "./pages/TablaSalidasPage";
import { RegistroSalidaForm } from "./pages/RegistroSalidaForm";
import { TablaRecetasPage } from "./pages/TablaRecetasPage";
import { TablaCoccionesPage } from "./pages/TablaCoccionesPage";
import { RegistroCoccionesPage } from "./pages/RegistroCoccionesForm";
import { RegistroRecetasForm } from "./pages/RegistroRecetas";
import cookieService from "./services/cookieService";
import { useState, useEffect } from "react";

function ProtectedRoute({ element: Component, ...rest }) {
  const isAuthenticated = cookieService.getToken();

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(
    cookieService.getToken() !== undefined
  );

  useEffect(() => {
    // Verificar la autenticación usando cookies al cargar la aplicación
    const accessToken = cookieService.getToken();

    if (accessToken) {
      // Si hay un token de acceso en las cookies, considerar al usuario autenticado
      setAuthenticated(true);
    }
  }, []);

  const handleAuthentication = (status) => {
    setAuthenticated(status);

    // Actualizar el estado de autenticación en las cookies
    if (status) {
      cookieService.setToken("yourAccessTokenValue");
    } else {
      cookieService.removeToken();
    }
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage handleAuthentication={handleAuthentication} />}
          />
          <Route path="/" element={<ProtectedRoute element={Inicio} />} />
          <Route path="/proveedores" element={<ProtectedRoute element={<ProveedoresPage />} />} />
          <Route path="/altaproveedores" element={<ProtectedRoute element={<AltaProvPage />} />} />
          <Route path="/tablainsumos" element={<ProtectedRoute element={<TablaInsumosPage />} />} />
          <Route path="/altainsumos" element={<ProtectedRoute element={<AltaInsumosPage />} />} />
          <Route path="/entradas" element={<ProtectedRoute element={<TablaEntradasPage />} />} />
          <Route path="/registroentradas" element={<ProtectedRoute element={<RegistroEntradaForm />} />} />
          <Route path="/salidas" element={<ProtectedRoute element={<TablaSalida />} />} />
          <Route path="/registrosalidas" element={<ProtectedRoute element={<RegistroSalidaForm />} />} />
          <Route path="/recetas" element={<ProtectedRoute element={<TablaRecetasPage />} />} />
          <Route path="/cocciones" element={<ProtectedRoute element={<TablaCoccionesPage />} />} />
          <Route path="/nuevacoccion" element={<ProtectedRoute element={<RegistroCoccionesPage />} />} />
          <Route path="/registrorecetas" element={<ProtectedRoute element={<RegistroRecetasForm />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
