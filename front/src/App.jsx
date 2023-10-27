import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./pages/Menu";
import { Inicio } from "./components/Inicio";
import ProveedoresPage from "./pages/ProveedoresPage";
import {TablaInsumosPage} from './pages/TablaInsumosPage'
import AltaInsumosPage from "./pages/AltaInsumosPage";
import { AltaProvPage } from './pages/AltaProvPage';
import { TablaSalida } from "./pages/TablaSalidasPage";
import { RegistroSalidaForm } from "./pages/RegistroSalidaForm";


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= '/' element={<Menu/>}/>
          <Route path="/inicio" element={<Inicio/>}/>
          <Route path="/proveedores" element={<ProveedoresPage/>}/>
          <Route path= '/altaproveedores' element={<AltaProvPage/>}/>
          <Route path= '/tablainsumos' element={<TablaInsumosPage/>}/>
          <Route path= '/altainsumos' element={<AltaInsumosPage/>}/>
          <Route path= '/salidas' element={<TablaSalida/>}/>
          <Route path= '/registrosalidas' element={<RegistroSalidaForm/>}/>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
