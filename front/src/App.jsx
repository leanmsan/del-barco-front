/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

//authentication components 
import { LoginPage } from "./pages/LoginPage";
import { PasswordResetRequestPage } from "./pages/PasswordResetRequestPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { SignupPage } from "./pages/SignupPage";

// other imports 
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


function ProtectedRoute({ element: Component, ...rest }) {
  const isAuthenticated = cookieService.getToken();

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

import { NotFound } from "./components/NotFound";

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
      cookieService.deleteToken(); // Utiliza la función correcta para eliminar la cookie
    }
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage handleAuthentication={handleAuthentication} />} />
          <Route path="/forget-password" element={<PasswordResetRequestPage/>} />
          <Route path='/password-reset-confirm/:uid/:token' element={<ResetPasswordPage/>}/>
          <Route path="/otp/verify" element={<ProtectedRoute element={VerifyEmailPage} authenticated={authenticated} />} />
          <Route path="/signup" element={<ProtectedRoute element={SignupPage} authenticated={authenticated} />} />
          
          {/* Other routes */}
          <Route path="/" element={<ProtectedRoute element={Inicio} />} />
          <Route path="/proveedores" element={<ProtectedRoute element={ProveedoresPage} authenticated={authenticated} />} />
          <Route path="/altaproveedores" element={<ProtectedRoute element={AltaProvPage} authenticated={authenticated} />} />
          <Route path="/tablainsumos" element={<ProtectedRoute element={TablaInsumosPage} authenticated={authenticated} />} />
          <Route path="/altainsumos" element={<ProtectedRoute element={AltaInsumosPage} authenticated={authenticated} />} />
          <Route path="/entradas" element={<ProtectedRoute element={TablaEntradasPage} authenticated={authenticated} />} />
          <Route path="/registroentradas" element={<ProtectedRoute element={RegistroEntradaForm} authenticated={authenticated} />} />
          <Route path="/salidas" element={<ProtectedRoute element={TablaSalida} />} authenticated={authenticated} />
          <Route path="/registrosalidas" element={<ProtectedRoute element={RegistroSalidaForm} authenticated={authenticated} />} />
          <Route path="/recetas" element={<ProtectedRoute element={TablaRecetasPage} authenticated={authenticated} />} />
          <Route path="/cocciones" element={<ProtectedRoute element={TablaCoccionesPage} authenticated={authenticated} />} />
          <Route path="/nuevacoccion" element={<ProtectedRoute element={RegistroCoccionesPage} authenticated={authenticated} />} />
          <Route path="/registrorecetas" element={<ProtectedRoute element={RegistroRecetasForm} authenticated={authenticated} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
