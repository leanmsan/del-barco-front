import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import CustomTextField from '../CustomSearchTextField';

export const TablaInsumos = () => {
  const [insumos, setData] = useState([]);
  const [tablaInsumos, setTablaInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [orden, setOrden] = useState({
    campo: "nombre_insumo",
    direccion: "asc",
  });

  const unidadesDeMedida = ["Kg", "g", "Mg", "L", "Ml", "Cc"];

  const navigate = useNavigate();

  const navegarANuevoInsumo = () => {
    navigate("/altainsumos");
  };

  const descargarInforme = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/informe_insumos/");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe-insumos.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
  const insumosOrdenados = [...insumos].sort((a, b) => {
    const factorOrden = orden.direccion === "asc" ? 1 : -1;
    return a[orden.campo].localeCompare(b[orden.campo]) * factorOrden;
  });

  const handleChange = (event) => {
    setBusqueda(event.target.value);
    filtrar(event.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    let resultadosBusqueda = tablaInsumos.filter((elemento) => {
      if (
        elemento.nombre_insumo
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setData(resultadosBusqueda);
  };

  useEffect(() => {
    const fetchData = async (searchTerm = "") => {
      try {
        const insumosResponse = await axios.get(
          `http://127.0.0.1:8000/api/insumos/?search=${searchTerm}`
        );
        const proveedoresResponse = await axios.get(
          "http://127.0.0.1:8000/api/proveedores/"
        );
        setData(insumosResponse.data.insumos);
        setTablaInsumos(insumosResponse.data.insumos);
        setProveedores(proveedoresResponse.data.proveedores);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleModificarInsumo = (index) => {
    const insumoActual = tablaInsumos.find((e) => e.idinsumo === index);
    Swal.fire({
      title: "Modificar insumo",
      html: `<form id="form-modificar">
              <label htmlFor="nombre_insumo" style="display: block;">Nombre: </label>
              <input type="text" id="nombre_insumo" name="nombre_insumo" value="${
                insumoActual.nombre_insumo
              }" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="cantidad_disponible" style="display: block;">Cantidad: </label>
              <input type="number" id="cantidad_disponible" name="cantidad_disponible" value="${
                insumoActual.cantidad_disponible
              }" readonly style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="tipo_medida" style="display: block;">Tipo de medida:</label>
              <select id="tipo_medida" name="tipo_medida" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
                ${unidadesDeMedida
                  .map(
                    (unidadMedida) => `
                  <option value="${unidadMedida}" ${
                      insumoActual.tipo_medida === unidadMedida
                        ? "selected"
                        : ""
                    }>
                    ${unidadMedida}
                  </option>
                `
                  )
                  .join("")}
              </select>
              <label htmlFor="categoria" style="display: block;">Categoria:</label>
              <input type="text" id="categoria" name="categoria" value="${
                insumoActual.categoria
              }" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="precio_unitario" style="display: block;">Precio unitario:</label>
              <input type="number" id="precio_unitario" name="precio_unitario" value="${
                insumoActual.precio_unitario
              }" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="proveedor_id" style="display: block;">Proveedor:</label>
              <select id="proveedor_id" name="proveedor_id" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
                ${proveedores
                  .map(
                    (proveedor) => `
                  <option value="${proveedor.nombre_proveedor}" ${
                      insumoActual.proveedor_id === proveedor.nombre_proveedor
                        ? "selected"
                        : ""
                    }>
                    ${proveedor.nombre_proveedor}
                  </option>
                `
                  )
                  .join("")}
              </select>

            </form>`,
      showCancelButton: true,
      confirmButtonColor: "#1450C9",
      cancelButtonColor: "#FF3434",
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const form = document.getElementById("form-modificar");
        const idinsumo = index;
        const nuevoNombre = form.elements["nombre_insumo"].value;
        const nuevaCantidad = form.elements["cantidad_disponible"].value;
        const nuevaMedidas = form.elements["tipo_medida"].value;
        const nuevaCategoria = form.elements["categoria"].value;
        const nuevoPrecio = form.elements["precio_unitario"].value;
        const nuevoProveedor = form.elements["proveedor_id"].value;

        // Verificar que los campos no estén vacíos
        if (
          !nuevoNombre ||
          !nuevaCantidad ||
          !nuevaMedidas ||
          !nuevaCategoria ||
          !nuevoPrecio ||
          !nuevoProveedor
        ) {
          Swal.fire("Error", "Todos los campos son obligatorios", "error");
          return;
        }
        if (nuevoPrecio < 0) {
          Swal.fire(
            "Error",
            "El precio unitario no puede ser negativo",
            "error"
          );
          return;
        }

        try {
          await axios.patch(`http://127.0.0.1:8000/api/insumos/${idinsumo}/`, {
            nombre_insumo: nuevoNombre,
            cantidad_disponible: nuevaCantidad,
            tipo_medida: nuevaMedidas,
            categoria: nuevaCategoria,
            precio_unitario: nuevoPrecio,
            proveedor_id: nuevoProveedor,
          });

          const nuevaTablaInsumo = tablaInsumos.map((insumo) =>
            insumo.idinsumo === index
              ? {
                  ...insumo,
                  nombre_insumo: nuevoNombre,
                  cantidad_disponible: nuevaCantidad,
                  tipo_medida: nuevaMedidas,
                  categoria: nuevaCategoria,
                  precio_unitario: nuevoPrecio,
                  proveedor_id: nuevoProveedor,
                }
              : insumo
          );
          console.log("esto es nueva tabla insumo", nuevaTablaInsumo);
          setTablaInsumos(nuevaTablaInsumo);
          setData(nuevaTablaInsumo);
          Swal.fire(
            "Modificado",
            "El insumo ha sido modificado correctamente",
            "success"
          );
        } catch (error) {
          console.log("Error al realizar la solicitud PATCH:", error);
          Swal.fire("Error", "Error al actualizar el insumo", "error");
        }
      }
    });
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: ".section-content",
          popover: {
            title: "Insumos",
            description: "Aquí podrás ver todos los insumos cargados",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".button-on-table-modificar",
          popover: {
            title: "Modificar",
            description:
              "Puedes cambiar algún dato de insumo si crees necesario",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".input-search",
          popover: {
            title: "Buscar",
            description:
              "Si no encuentras lo que buscas, puedes ingresar el nombre del insumo para encontrarlo",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-informe",
          popover: {
            title: "Informe",
            description:
              "Haciendo click aquí podrás descargar un informe de los insumos",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-create",
          popover: {
            title: "Nuevo insumo",
            description:
              "También puedes ir a cargar un nuevo insumo directamente!",
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
      <h1 className="title">Insumos</h1>
      <div className="search-box">
       
        <CustomTextField value={busqueda} onChange={handleChange} />

        <button className="btn-create" onClick={navegarANuevoInsumo}>+ Nuevo insumo</button>
        <button onClick={descargarInforme} className="btn-informe">
          Descargar Informe
        </button>
      </div>

      <TableContainer class="table-container-format" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("nombre_insumo")}
              >
                Nombre insumo{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell class="cell-head-TableContainer">
                Cantidad disponible
              </TableCell>
              <TableCell class="cell-head-TableContainer">
                Tipo de medida
              </TableCell>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("categoria")}
              >
                Categoria{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell class="cell-head-TableContainer">
                Precio unitario
              </TableCell>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("proveedor_id")}
              >
                Proveedor{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell class="cell-head-TableContainer">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {insumosOrdenados.map((row) => (
              <TableRow key={row.idinsumo}>
                <TableCell>{row.nombre_insumo}</TableCell>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {row.cantidad_disponible}
                </TableCell>
                <TableCell>{row.tipo_medida}</TableCell>
                <TableCell>{row.categoria}</TableCell>
                <TableCell>{row.precio_unitario}</TableCell>
                <TableCell>{row.proveedor_id}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="button-on-table-modificar"
                    onClick={() => handleModificarInsumo(row.idinsumo)}
                  >
                    Modificar
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="btn-ayuda">
        <button onClick={driverAction} className="button-ayuda">
          <FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff" }} />
        </button>
      </div>
    </div>
  );
};
