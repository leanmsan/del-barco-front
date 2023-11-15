import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
//import { Menu } from "./pages/Menu";
import { LoginPage } from "./pages/LoginPage";
import { Inicio } from "./components/Inicio";
import ProveedoresPage from "./pages/ProveedoresPage";
import {TablaInsumosPage} from './pages/TablaInsumosPage'
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

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= '/login' element={<LoginPage/>}/>
          <Route path= '/' element={<Inicio/>} exact />
          {/* <Route path="/inicio" element={<Inicio/>}/> */}
          <Route path="/proveedores" element={<ProveedoresPage/>}/>
          <Route path= '/altaproveedores' element={<AltaProvPage/>}/>
          <Route path= '/tablainsumos' element={<TablaInsumosPage/>}/>
          <Route path= '/altainsumos' element={<AltaInsumosPage/>}/>
          <Route path= '/entradas' element={<TablaEntradasPage/>}/>
          <Route path= '/registroentradas' element={<RegistroEntradaForm/>}/>
          <Route path= '/salidas' element={<TablaSalida/>}/>
          <Route path= '/registrosalidas' element={<RegistroSalidaForm/>}/>
          <Route path= '/recetas' element={<TablaRecetasPage/>}/>
          <Route path= '/cocciones' element={<TablaCoccionesPage/>}/>
          <Route path= '/nuevacoccion' element={<RegistroCoccionesPage/>}/>
          <Route path= '/registrorecetas' element={<RegistroRecetasForm/>}/>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
