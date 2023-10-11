import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./pages/Menu";
import { Inicio } from "./components/Inicio";



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= '/' element={<Menu/>}/>
          <Route path="/inicio" element={<Inicio/>}/>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
