import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from '../assets/img/logo1.png'

export function SideBar({ handleTabClick, selectedTab, handleAuthentication }) {
  const navigate = useNavigate();
  const [entradasOpen, setEntradasOpen] = useState(false);
  const [salidasOpen, setSalidasOpen] = useState(false);
  const [insumosOpen, setInsumosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);
  const [recetasOpen, setRecetasOpen] = useState(false);
  const [coccionesOpen, setCoccionesOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    handleAuthentication(false);
    navigate("/login");
  };

  const toggleEntradas = () => {
    setEntradasOpen(!entradasOpen);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setCoccionesOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false)
  };

  const toggleSalidas = () => {
    setSalidasOpen(!salidasOpen);
    setEntradasOpen(false);
    setRecetasOpen(false);
    setCoccionesOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false)
  };

  const toogleRecetas = () => {
    setRecetasOpen(!recetasOpen);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setCoccionesOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false)
  };

  const toggleCocciones = () => {
    setCoccionesOpen(!coccionesOpen);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false)
  };

  const toggleInsumos = () => {
    setInsumosOpen(!insumosOpen);
    setCoccionesOpen(false);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setProveedoresOpen(false)
  };

  const toggleProveedores = () => {
    setProveedoresOpen(!proveedoresOpen);
    setCoccionesOpen(false);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setInsumosOpen(false)
  };

  const handleLogoClick = () => {
    navigate("/inicio");
  }

  return (
    <nav  className="scrollable-sidebar">
      
        <div className="logo-image">
         <img src={logo} alt="Logo Cervecería Del Barco" onClick={handleLogoClick}/>
        </div>
      
      <div className="menu-items">
        <div>
        <ul className="nav-links">
          <li
            className={`nav-link-item ${
              selectedTab === "productos" ? "active" : ""
            }`}
          >
            <Link to="/tablainsumos">
              <i className="fa-solid fa-cart-flatbed nav-link-icon"></i>
              <span className="link-name">Insumos</span>
            </Link>
          </li>
          <li
            className={`nav-link-item ${
              selectedTab === "altaInsumos" ? "active" : ""
            }`}
          >
            <Link to="/altainsumos">
              <i className="fa-solid fa-square-plus nav-link-icon"></i>
              <span className="link-name">Nuevo insumo</span>
            </Link>
          </li>
          <li
            className={`nav-link-item ${
              selectedTab === "proveedores" ? "active" : ""
            }`}
          >
            <Link to="/proveedores">
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Proveedores</span>
            </Link>
          </li>

          <li
            className={`nav-link-item ${
              selectedTab === "proveedores" ? "active" : ""
            }`}
          >
            <Link to="/altaproveedores">
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Nuevo proveedor</span>
            </Link>
          </li>

          <li
            className={`nav-link-item ${selectedTab === "registroentradas" ? "active" : ""
          } ${selectedTab === "entradas" ? "active" : ""
          }`}
          >
            <Link onClick={toggleEntradas}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Entradas</span>
            </Link>
          </li>

          <li
            className={`nav-link-item ${
              selectedTab === "movimientos" ? "active" : ""
            } ${entradasOpen ? "active fade-in" : "fade-out"}`}
          >
            {entradasOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/registroentradas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nueva entrada</span>
                  </Link>
                  <Link to="/entradas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Tabla de entradas</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>


          <li
            className={`nav-link-item ${
              selectedTab === "movimientos" ? "active" : ""
            }`}
          >
            <Link onClick={toggleSalidas}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Salidas</span>
            </Link>
          </li>

          <li
            className={`nav-link-item ${
              selectedTab === "movimientos" ? "active" : ""
            } ${salidasOpen ? "active fade-in" : "fade-out"}`}
          >
            {salidasOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/registrosalidas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nueva salida</span>
                  </Link>
                  <Link to="/salidas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Tabla de salidas</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          
          <li
            className={`nav-link-item ${
              selectedTab === "recetas" ? "active" : ""
            }`}
          >
            <Link onClick={toogleRecetas}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Recetas</span>
            </Link>
          </li>
          <li
            className={`nav-link-item ${
              selectedTab === "recetas" ? "active" : ""
            } ${recetasOpen ? "active fade-in" : "fade-out"}`}
          >
            {recetasOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/registrorecetas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nueva receta</span>
                  </Link>
                  <Link to="/recetas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Tabla de recetas</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          
          <li
            className={`nav-link-item ${
              selectedTab === "cocciones" ? "active" : ""
            }`}
          >
            <Link onClick={toggleCocciones}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Cocciones</span>
            </Link>
          </li>
          <li
            className={`nav-link-item ${
              selectedTab === "cocciones" ? "active" : ""
            } ${coccionesOpen ? "active fade-in" : "fade-out"}`}
          >
            {coccionesOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/nuevacoccion">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nueva cocción</span>
                  </Link>
                  <Link to="/cocciones">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Cocciones</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

        </ul>

        {/* <ul className="logout-mod">
          <li className="nav-link-item">
            <Link onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket nav-link-icon"></i>
              <span className="link-name">Salir</span>
            </Link>
          </li>
        </ul> */}
        </div>
        
      </div>
    </nav>
  );
}
