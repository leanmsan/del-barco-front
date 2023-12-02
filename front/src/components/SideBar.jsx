import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import cookieService from "../services/cookieService";
import logo from "../assets/img/Logo1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export function SideBar(selectedTab) {
  const navigate = useNavigate();
  const [entradasOpen, setEntradasOpen] = useState(false);
  const [salidasOpen, setSalidasOpen] = useState(false);
  const [insumosOpen, setInsumosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);
  const [recetasOpen, setRecetasOpen] = useState(false);
  const [coccionesOpen, setCoccionesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Agrega una función para manejar la alternancia del menú
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen);
  };

  const toggleEntradas = () => {
    setEntradasOpen(!entradasOpen);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setCoccionesOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false);
  };

  const toggleSalidas = () => {
    setSalidasOpen(!salidasOpen);
    setEntradasOpen(false);
    setRecetasOpen(false);
    setCoccionesOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false);
  };

  const toogleRecetas = () => {
    setRecetasOpen(!recetasOpen);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setCoccionesOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false);
  };

  const toggleCocciones = () => {
    setCoccionesOpen(!coccionesOpen);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setProveedoresOpen(false);
    setInsumosOpen(false);
  };

  const toggleInsumos = () => {
    setInsumosOpen(!insumosOpen);
    setCoccionesOpen(false);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setProveedoresOpen(false);
  };

  const toggleProveedores = () => {
    setProveedoresOpen(!proveedoresOpen);
    setCoccionesOpen(false);
    setEntradasOpen(false);
    setSalidasOpen(false);
    setRecetasOpen(false);
    setInsumosOpen(false);
  };

  const Logout = (handleAuthentication) => {
    function deleteTokenCookie() {
      // Utiliza el mismo nombre de cookie que se establece en handleAuthentication
      cookieService.removeToken();
    }

    deleteTokenCookie();
    handleAuthentication(false);
    console.log('Redireccionando a /login')
    navigate('/login');
  }

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className={`scrollable-sidebar ${isSidebarOpen ? "" : "close"}`}>
      <div className="sidebar-button">
        <button className="sidebar-toggle" onClick={handleToggleSidebar}>
          <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />
        </button>
      </div>
      <div className="logo-image clickeable">
        <img
          src={logo}
          alt="Logo Cervecería Del Barco"
          onClick={handleLogoClick}
        />
      </div>
  
      <div className="menu-items" id="side-bar">
        <ul className="nav-links">
          {/* Insumos */}
          <li
            className={`nav-link-item ${selectedTab === "registroentradas" ? "active" : ""
              } ${selectedTab === "entradas" ? "active" : ""}`}
          >
            <Link onClick={toggleInsumos}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Insumos</span>
            </Link>
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "insumos" ? "active" : ""
              } ${insumosOpen ? "active fade-in" : "fade-out"}`}
          >
            {insumosOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/altainsumos">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nuevo insumo</span>
                  </Link>
                  <Link to="/tablainsumos">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Lista de insumos</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
  
          {/* Proveedores */}
          <li
            className={`nav-link-item ${selectedTab === "registroentradas" ? "active" : ""
              } ${selectedTab === "entradas" ? "active" : ""}`}
          >
            <Link onClick={toggleProveedores}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Proveedores</span>
            </Link>
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "proveedores" ? "active" : ""
              } ${proveedoresOpen ? "active fade-in" : "fade-out"}`}
          >
            {proveedoresOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/altaproveedores">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nuevo proveedor</span>
                  </Link>
                  <Link to="/proveedores">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Lista de proveedores</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "registroentradas" ? "active" : ""
              } ${selectedTab === "entradas" ? "active" : ""}`}
          >
            <Link onClick={toggleEntradas}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Ingresos</span>
            </Link>
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "movimientos" ? "active" : ""
              } ${entradasOpen ? "active fade-in" : "fade-out"}`}
          >
            {entradasOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/registroentradas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nuevo ingreso</span>
                  </Link>
                  <Link to="/entradas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Lista de ingresos</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "movimientos" ? "active" : ""
              }`}
          >
            <Link onClick={toggleSalidas}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Egresos</span>
            </Link>
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "movimientos" ? "active" : ""
              } ${salidasOpen ? "active fade-in" : "fade-out"}`}
          >
            {salidasOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="/registrosalidas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Nuevo egreso</span>
                  </Link>
                  <Link to="/salidas">
                    <i className="fa-solid fa-cash-register nav-link-icon"></i>
                    <span className="link-name">Lista de egresos</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "recetas" ? "active" : ""
              }`}
          >
            <Link onClick={toogleRecetas}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Recetas</span>
            </Link>
          </li>
  
          <li
            className={`nav-link-item ${selectedTab === "recetas" ? "active" : ""
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
                    <span className="link-name">Lista de recetas</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            className={`nav-link-item ${selectedTab === "cocciones" ? "active" : ""
              }`}
          >
            <Link onClick={toggleCocciones}>
              <i className="fa-solid fa-person-circle-plus nav-link-icon"></i>
              <span className="link-name">Cocciones</span>
            </Link>
          </li>
          <li
            className={`nav-link-item ${selectedTab === "cocciones" ? "active" : ""
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
                    <span className="link-name">Lista de cocciones</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
  
        <ul className="logout-mod">
          <li className="nav-link-item">
            <Link onClick={Logout}>
              <i className="fa-solid fa-right-from-bracket nav-link-icon"></i>
              <span className="link-name">Salir</span>
            </Link>
          </li>
        </ul>
      </div>
  
      <div className="info-the-five">
        <p
          className="txt-the-five"
          style={{
            backgroundImage:
              "linear-gradient(to right, blue, blue 20%, white 20%, white 30%, red 30%, red 70%, white 70%, white 80%, blue 80%, blue)",
            backgroundSize: "100% 8px",
            backgroundRepeat: "no-repeat",
            backgroundPositionY: "top",
          }}
        >
          Desarrollado por The Five
        </p>
      </div>
    </nav>
  )
}