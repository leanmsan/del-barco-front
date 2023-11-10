import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from '../assets/img/logo1.png'

export function SideBar({ handleTabClick, selectedTab, handleAuthentication }) {
  const navigate = useNavigate();
  const [entradasOpen, setEntradasOpen] = useState(false);
  const [salidasOpen, setSalidasOpen] = useState(false);
  const [insumosOpen, setInsumosOpen] = useState(false);
  const [recetasOpen, setRecetasOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    handleAuthentication(false);
    navigate("/login");
  };

  const toggleEntradas = () => {
    setEntradasOpen(!entradasOpen);
    setSalidasOpen(false);
    setRecetasOpen(false)
  };

  const toggleSalidas = () => {
    setSalidasOpen(!salidasOpen);
    setEntradasOpen(false);
    setRecetasOpen(false)
  };

  const toogleRecetas = () => {
    setRecetasOpen(!recetasOpen);
    setEntradasOpen(false);
    setSalidasOpen(false)

  };
  const toggleInsumos = () => {
    setSalidasOpen(!insumosOpen);
    setEntradasOpen(false);
  };

  const toggleProveedores = () => {
    setSalidasOpen(!productosOpen);
    setEntradasOpen(false);
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
              <span className="link-name">Alta de insumos</span>
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
              <span className="link-name">Alta de Proveedores</span>
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
                    <span className="link-name">Registro de entradas</span>
                  </Link>
                  <Link to="/entradas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Tabla Entradas</span>
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
                    <span className="link-name">Registro de salidas</span>
                  </Link>
                  <Link to="/salidas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Tabla Salidas</span>
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
                    <span className="link-name">Registro Recetas</span>
                  </Link>
                  <Link to="/recetas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Tabla Recetas</span>
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
