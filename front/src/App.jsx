import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./pages/Menu";



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= '/' element={<Menu/>}/>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
