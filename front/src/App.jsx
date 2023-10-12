import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./pages/Menu";
import {TablaInsumosPage} from './pages/TablaInsumosPage'



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= '/' element={<Menu/>}/>
          <Route path= '/tablainsumos' element={<TablaInsumosPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
