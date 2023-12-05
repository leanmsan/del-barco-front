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

export const TablaSalidasMovimientos = () => {
  const [salidas, setSalidas] = useState([]);
  const [salidasDetalle, setSalidasDetalle] = useState([]);
  const [selectedSalidas, setSelectedSalidas] = useState(null);
  const [seleccionarInsumo, setSeleccionarInsumo] = useState([]);
  const [showSalidasDetalle, setShowSalidasDetalle] = useState(false);
  const [orden, setOrden] = useState({
    campo: "idsalida",
    direccion: "asc",
  });

  const navigate = useNavigate();

  const navegarANuevaSalida = () => {
    navigate("/registrosalidas");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseSalida = await axios.get(
        "http://127.0.0.1:8000/api/salidas/"
      );
      const responseSalidaDetalles = await axios.get(
        "http://127.0.0.1:8000/api/salida_detalles/"
      );
      setSalidas(responseSalida.data.salidas);
      setSalidasDetalle(responseSalidaDetalles.data.salidas);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
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
  const salidasOrdenadas = [...salidas].sort((a, b) => {
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


  const renderSalidas = () => {
    const handleSalidasClick = (idsalida) => {
      setSelectedSalidas(idsalida);
      setShowSalidasDetalle(true);
    };

    return (
      <TableContainer
        component={Paper}
        class="table-container-format tabla-egresos"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("idsalida")}
              >
                ID Egreso{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("fecha_salida")}
              >
                Fecha{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salidasOrdenadas.map((salida) => (
              <TableRow
                key={salida.idsalida}
                onClick={() => handleSalidasClick(salida.idsalida)}
                className={
                  selectedSalidas === salida.idsalida ? "selected-row" : "clickeable"
                }
              >
                <TableCell
                  style={{
                    fontWeight:
                      selectedSalidas === salida.idsalida ? "bold" : "normal",
                  }}
                >
                  {salida.idsalida}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight:
                      selectedSalidas === salida.idsalida ? "bold" : "normal",
                  }}
                >
                  {salida.fecha_salida
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderSalidasDetalle = () => {
    const filteredSalidasDetalle = salidasDetalle.filter(
      (salidasDetalle) => salidasDetalle.idsalida_id === selectedSalidas
    );

    const handleCloseSalidasDetalle = () => {
      setShowSalidasDetalle(false);
      setSelectedSalidas(null);
    };

    return (
      <>
        {showSalidasDetalle && (
          <>
            <h2 className="subtitulo-tablas">
              Detalles de egresos
              <button
                className="button-cerrar-detalles"
                onClick={handleCloseSalidasDetalle}
              >
                Cerrar detalles
              </button>
            </h2>
            <TableContainer component={Paper} class="table-container-format">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell class="cell-head-TableContainer">
                      ID Salidas
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Nombre insumo
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Cantidad
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSalidasDetalle.map((salidasDetalle) => (
                    <TableRow
                      key={`${salidasDetalle.idsalida_id}-${salidasDetalle.insumo_id}`}
                    >
                      <TableCell>{salidasDetalle.idsalida_id}</TableCell>
                      <TableCell>{salidasDetalle.insumo_id}</TableCell>
                      <TableCell>{`${salidasDetalle.cantidad} ${seleccionarInsumo.find((insumo) => insumo.nombre_insumo === salidasDetalle.insumo_id)?.tipo_medida}`}</TableCell>
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
            title: "Egresos",
            description:
              "Aquí podrás ver los datos de los insumos que salieron",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".tabla-egresos",
          popover: {
            title: "Lista de egresos",
            description: "Aquí podrás ver el listado de todos los egresos",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".tabla-egresos",
          popover: {
            title: "Seleccionar",
            description:
              "Cuando hagas click sobre algún egreso, podrás ver los detalles más abajo",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".btn-create-sin-searchbox",
          popover: {
            title: "Nuevo egreso",
            description:
              "También puedes ir a registrar un nuevo egreso directamente!",
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
        <h1 className="title">Egresos</h1>
        <button className="btn-create-sin-searchbox" onClick={navegarANuevaSalida}>+ Nuevo egreso</button>
        {renderSalidas()}
        {selectedSalidas && <>{renderSalidasDetalle()}</>}
      </div>
      <div className="btn-ayuda">
        <button onClick={driverAction} className="button-ayuda">
          <FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff" }} />
        </button>
      </div>
    </div>
  );
};
