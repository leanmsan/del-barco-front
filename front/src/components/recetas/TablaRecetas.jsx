import React, { useEffect, useState } from "react";
import axios from "axios";
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
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const TablaRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [recetasDetalle, setRecetaDetalle] = useState([]);
  const [selectedRecetas, setSelectedRecetas] = useState(null);
  const [showRecetasDetalle, setShowRecetasDetalle] = useState(false);
  const [listaInsumos, setListaInsumos] = useState([]);
  const unidadesDeMedidas = ["Kg", "g", "Mg", "L", "Ml", "Cc"];
  const [orden, setOrden] = useState({
    campo: "nombre_receta",
    direccion: "asc",
  });

  const navigate = useNavigate();

  const navegarANuevaReceta = () => {
    navigate("/registrorecetas");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseRecetas = await axios.get(
        "http://127.0.0.1:8000/api/recetas/"
      );
      const responseRecetasDetalles = await axios.get(
        "http://127.0.0.1:8000/api/receta_detalles/"
      );
      const responseInsumos = await axios.get(
        "http://127.0.0.1:8000/api/insumos/"
      );

      setRecetas(responseRecetas.data.recetas);
      setRecetaDetalle(responseRecetasDetalles.data.recetas);
      setListaInsumos(responseInsumos.data.insumos);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

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
  const recetasOrdenadas = [...recetas].sort((a, b) => {
    const factorOrden = orden.direccion === "asc" ? 1 : -1;
    return a[orden.campo].localeCompare(b[orden.campo]) * factorOrden;
  });

  const renderRecetas = () => {
    const handleRecetasClick = (nombre_receta) => {
      setSelectedRecetas(nombre_receta);
      setShowRecetasDetalle(true);
    };

    return (
      <TableContainer
        class="table-container-format tabla-recetas"
        component={Paper} 
      >
        <Table
        sx={{
          "& .MuiTableCell-root": {
            fontFamily: "Poppins, sans-serif",
          },
          "& .MuiTableRow-root": {
            fontFamily: "Poppins, sans-serif",
          },
        }}>
          <TableHead>
            <TableRow>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("nombre_receta")}
              >
                Nombre{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("tipo")}
              >
                Tipo{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell
                class="cell-head-TableContainer"
              >
                Litros
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recetasOrdenadas.map((receta) => (
              <TableRow
                key={receta.nombre_receta}
                onClick={() => handleRecetasClick(receta.nombre_receta)}
                className={
                  selectedRecetas === receta.nombre_receta
                    ? "selected-row"
                    : "clickeable"
                }
              >
                <TableCell
                  style={{
                    fontWeight:
                      selectedRecetas === receta.nombre_receta
                        ? "bold"
                        : "normal",
                  }}
                >
                  {receta.nombre_receta}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight:
                      selectedRecetas === receta.nombre_receta
                        ? "bold"
                        : "normal",
                  }}
                >
                  {receta.tipo}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight:
                      selectedRecetas === receta.nombre_receta
                        ? "bold"
                        : "normal",
                  }}
                >
                  {receta.litros}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderRecetasDetalle = () => {
    const filteredRecetasDetalle = recetasDetalle.filter(
      (recetaDetalle) => recetaDetalle.receta_id === selectedRecetas
    );

    const handleCloseRecetasDetalle = () => {
      setShowRecetasDetalle(false);
      setSelectedRecetas(null);
    };

    const handleModificarDetalles = (detalleId) => {
      const detallesActuales = recetasDetalle.find(
        (detalle) => detalle.idrecetadetalle === detalleId
      );

      const formId = `form-modificar-detalles-${detallesActuales.idrecetadetalle}`;

      Swal.fire({
        title: "Modificar detalles de receta",
        html: `<form id="${formId}">
                <label htmlFor="insumo_id-${detalleId}" style="display: block;">Insumo:</label>
                <input type="text" id="insumo_id-${detalleId}" name="insumo_id" value="${detallesActuales.insumo_id}" required readOnly style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
                <br />
                <label htmlFor="tipo_medida-${detalleId}" style="display: block;">Tipo de medida:</label>
                <input type="text" id="tipo_medida-${detalleId}" name="tipo_medida" value="${detallesActuales.tipo_medida}" required readOnly style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
                <br />
                <label htmlFor="cantidad_disponible-${detalleId}" style="display: block;">Cantidad:</label>
                <input type="number" id="cantidad_disponible-${detalleId}" name="cantidad_disponible" value="${detallesActuales.cantidad}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
                <br/>
              </form>`,
        showCancelButton: true,
        confirmButtonColor: "#1450C9",
        cancelButtonColor: "#FF3434",
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const form = document.getElementById(formId);
          const nuevoInsumo = form.elements[`insumo_id-${detalleId}`].value;
          const nuevaCantidad =
            form.elements[`cantidad_disponible-${detalleId}`].value;
          const nuevoTipoMedida =
            form.elements[`tipo_medida-${detalleId}`].value;

          if (!nuevoInsumo || !nuevaCantidad || !nuevoTipoMedida) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return;
          }

          // Validar que la cantidad no sea negativa
          if (parseFloat(nuevaCantidad) < 0) {
            Swal.fire("Error", "La cantidad no puede ser negativa", "error");
            return;
          }

          try {
            await axios.patch(
              `http://127.0.0.1:8000/api/receta_detalles/${detallesActuales.idrecetadetalle}/`,
              {
                insumo_id: nuevoInsumo,
                cantidad: nuevaCantidad,
                tipo_medida: nuevoTipoMedida,
              }
            );

            const nuevosDetalles = recetasDetalle.map((detalle) =>
              detalle.idrecetadetalle === detallesActuales.idrecetadetalle
                ? {
                    ...detalle,
                    insumo_id: nuevoInsumo,
                    cantidad: nuevaCantidad,
                    tipo_medida: nuevoTipoMedida,
                  }
                : detalle
            );
            setRecetaDetalle(nuevosDetalles);
            Swal.fire(
              "Modificado",
              "Los detalles de la receta han sido modificados correctamente",
              "success"
            );
          } catch (error) {
            console.error("Error al realizar la solicitud PATCH:", error);
            Swal.fire(
              "Error",
              "Error al actualizar los detalles de la receta",
              "error"
            );
          }
        }
      });
    };

    return (
      <>
        {showRecetasDetalle && (
          <>
            <h2 className="subtitulo-tablas">
              Detalles de receta
              <button
                className="button-cerrar-detalles"
                onClick={handleCloseRecetasDetalle}
              >
                Cerrar detalles
              </button>
            </h2>
            <TableContainer class="table-container-format" component={Paper}>
              <Table
              sx={{
                "& .MuiTableCell-root": {
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiTableRow-root": {
                  fontFamily: "Poppins, sans-serif",
                },
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell class="cell-head-TableContainer">
                      Insumo
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Cantidad
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecetasDetalle.map((e) => (
                    <TableRow key={`${e.receta_id}-${e.insumo_id}`}>
                      <TableCell>{e.insumo_id}</TableCell>
                      <TableCell>{e.cantidad} {e.tipo_medida}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="button-on-table-modificar btn-modif"
                          onClick={() =>
                            handleModificarDetalles(e.idrecetadetalle)
                          }
                        >
                          Modificar Detalles
                        </button>
                      </TableCell>
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
            title: "Recetas",
            description: "Aquí podrás ver las recetas y sus detalles",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".tabla-recetas",
          popover: {
            title: "Lista de egresos",
            description: "Aquí podrás ver el listado de todas las recetas",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".tabla-recetas",
          popover: {
            title: "Seleccionar",
            description:
              "Cuando hagas click sobre alguna receta, podrás ver los detalles más abajo",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".btn-modif",
          popover: {
            title: "Modificar",
            description:
              "También vas a poder modificar las cantidades de los insumos si te confundiste",
          },
        },
        {
          element: ".btn-create-sin-searchbox",
          popover: {
            title: "Nueva receta",
            description:
              "También puedes ir a registrar una nueva receta directamente!",
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
        <h1 className="title">Recetas</h1>
        <button className="btn-create-sin-searchbox" onClick={navegarANuevaReceta}>+ Nueva receta</button>
        {renderRecetas()}
        {selectedRecetas && <>{renderRecetasDetalle()}</>}
      </div>
      <div className="btn-ayuda">
        <button onClick={driverAction} className="button-ayuda">
          <FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff" }} />
        </button>
      </div>
    </div>
  );
};
