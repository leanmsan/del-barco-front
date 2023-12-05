import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const TablaEntradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [EntradasDetalle, setEntradasDetalle] = useState([]);
  const [selectedEntrada, setSelectedEntrada] = useState(null);
  const [showEntradaDetalle, setShowEntradaDetalle] = useState(false);
  const [seleccionarInsumo, setSeleccionarInsumo] = useState([]);
  const [orden, setOrden] = useState({
    campo: "identrada",
    direccion: "asc",
  });

  const navigate = useNavigate();

  const navegarANuevaEntrada = () => {
    navigate("/registroentradas");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseEntrada = await axios.get(
        "http://127.0.0.1:8000/api/entradas/"
      );
      const responseEntradaDetalle = await axios.get(
        "http://127.0.0.1:8000/api/entrada_detalles"
      );
      setEntradas(responseEntrada.data.entradas);
      setEntradasDetalle(responseEntradaDetalle.data.entradas);
    } catch (error) {
      console.log("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/insumos/");
        const data = await response.json();

        if (response.ok) {
          setSeleccionarInsumo(data.insumos);
        } else {
          console.log("Error al obtener los insumos", response);
        }
      } catch (error) {
        console.log("Error de red", error);
      }
    };

    fetchInsumos();
  }, []);

  const handleOrdenar = (campo) => {
    setOrden((estadoAnterior) => ({
      campo,
      direccion:
        estadoAnterior.campo === campo && estadoAnterior.direccion === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Función para ordenar los insumos según el estado actual
  const entradasOrdenadas = [...entradas].sort((a, b) => {
    const factorOrden = orden.direccion === "asc" ? 1 : -1;
    const aValue = a[orden.campo];
    const bValue = b[orden.campo];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * factorOrden;
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * factorOrden;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return (aValue.getTime() - bValue.getTime()) * factorOrden;
    } else {
      return String(aValue).localeCompare(String(bValue)) * factorOrden;
    }
  });

  const renderEntradas = () => {
    const handleEntradaClick = (identrada) => {
      setSelectedEntrada(identrada);
      setShowEntradaDetalle(true);
    };

    return (
      <TableContainer
        component={Paper}
        class="table-container-format tabla-ingresos"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("identrada")}
              >
                ID Ingreso{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("proveedor_id")}
              >
                Proveedor{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("fecha_entrada")}
              >
                Fecha{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell class="cell-head-TableContainer">
                Monto Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entradasOrdenadas.map((entrada) => (
              <TableRow
                key={entrada.identrada}
                onClick={() => handleEntradaClick(entrada.identrada)}
                className={
                    selectedEntrada === entrada.identrada ? "selected-row" : "clickeable"
                }
              >
                <TableCell
                  style={{
                    fontWeight:
                      selectedEntrada === entrada.identrada ? "bold" : "normal",
                  }}
                >
                  {entrada.identrada}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight:
                      selectedEntrada === entrada.identrada ? "bold" : "normal",
                  }}
                >
                  {entrada.proveedor_id}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight:
                      selectedEntrada === entrada.identrada ? "bold" : "normal",
                  }}
                >
                  {//format(
                  entrada.fecha_entrada 
                  }
                </TableCell>
                <TableCell
                  style={{
                    fontWeight:
                      selectedEntrada === entrada.identrada ? "bold" : "normal",
                  }}
                >
                  {entrada.monto_total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderEntradasDetalle = () => {
    const filteredEntradasDetalle = EntradasDetalle.filter(
      (entradasDetalle) => entradasDetalle.identrada_id === selectedEntrada
    );

    const handleCloseEntradaDetalle = () => {
      setShowEntradaDetalle(false);
      setSelectedEntrada(null);
    };

    return (
      <>
        {showEntradaDetalle && (
          <>
            <h2 className="subtitulo-tablas">
              Detalles de ingreso
              <button
                className="button-cerrar-detalles"
                onClick={handleCloseEntradaDetalle}
              >
                Cerrar detalles
              </button>
            </h2>
            <TableContainer
              component={Paper}
              class="table-container-format tabla-detalles"
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell class="cell-head-TableContainer">
                      ID Entrada
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Insumo
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Cantidad
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Precio Unitario
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntradasDetalle.map((entradasDetalle) => (
                    <TableRow
                      key={`${entradasDetalle.identrada}-${entradasDetalle.insumo_id}`}
                    >
                      <TableCell>{entradasDetalle.identrada_id}</TableCell>
                      <TableCell>{entradasDetalle.insumo_id}</TableCell>
                      <TableCell>{`${entradasDetalle.cantidad} ${seleccionarInsumo.find((insumo) => insumo.nombre_insumo === entradasDetalle.insumo_id)?.tipo_medida}`}</TableCell>
                      <TableCell>{entradasDetalle.precio_unitario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </>
    );
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: ".section-content",
          popover: {
            title: "Ingresos",
            description:
              "Aquí podrás ver los datos de los insumos que ingresaron",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".tabla-ingresos",
          popover: {
            title: "Lista de ingresos",
            description: "Aquí podrás ver el listado de todos los ingresos",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".tabla-ingresos",
          popover: {
            title: "Seleccionar",
            description:
              "Cuando hagas click sobre algún ingreso, podrás ver los detalles más abajo",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".btn-create-sin-searchbox",
          popover: {
            title: "Nuevo ingreso",
            description:
              "También puedes ir a registrar un nuevo ingreso directamente!",
            side: "right",
            align: "start",
          },
        },
        {
          popover: {
            title: "Eso es todo!",
            description: "Ya puedes continuar",
          },
        },
      ],
      nextBtnText: "Próximo",
      prevBtnText: "Anterior",
      doneBtnText: "Finalizar",
      progressText: "{{current}} de {{total}}",
    });
    driverObj.drive();
  };

  return (
    <div className="section-content">
      <div>
        <h1 className="title">Ingresos</h1>

        <button className="btn-create-sin-searchbox" onClick={navegarANuevaEntrada}>+ Nuevo ingreso</button>
        
        {renderEntradas()}
        {selectedEntrada && <>{renderEntradasDetalle()}</>}
      </div>
      <div className="btn-ayuda">
        <button onClick={driverAction} className="button-ayuda">
          <FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff" }} />
        </button>
      </div>
    </div>
  );
};
