import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./pages/Menu";
import { Inicio } from "./components/Inicio";
import ProveedoresPage from "./pages/ProveedoresPage";
import {TablaInsumosPage} from './pages/TablaInsumosPage'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= '/' element={<Menu/>}/>
          <Route path="/inicio" element={<Inicio/>}/>
          <Route path="/proveedores" element={<ProveedoresPage/>}/>
          <Route path= '/tablainsumos' element={<TablaInsumosPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
