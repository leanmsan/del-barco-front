import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import CustomTextField from '../CustomSearchTextField';
import { useNavigate } from "react-router-dom";

export const TablaProveedores = () => {
  const [proveedores, setData] = useState([]);
  const [tablaProveedores, setTablaProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({
    campo: "nombre_proveedor",
    direccion: "asc",
  });

  const handleChange = (event) => {
    setBusqueda(event.target.value);
    filtrar(event.target.value);
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
  const proveedoresOrdenados = [...proveedores].sort((a, b) => {
    const factorOrden = orden.direccion === "asc" ? 1 : -1;
    return a[orden.campo].localeCompare(b[orden.campo]) * factorOrden;
  });

  const filtrar = (terminoBusqueda) => {
    let resultadosBusqueda = tablaProveedores.filter((elemento) => {
      if (
        elemento.nombre_proveedor.toString().toLowerCase() !== "proveedor no especificado" &&
        elemento.nombre_proveedor
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setData(resultadosBusqueda);
  };

  const navigate = useNavigate();

  const navegarANuevoProveedor = () => {
    navigate("/altaproveedores");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (searchTerm = "") => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/proveedores/?search=${searchTerm}`
      );

      const filteredProveedores = response.data.proveedores.filter(
        (proveedor) => proveedor.nombre_proveedor.toLowerCase() !== "proveedor no especificado"
      );

      const sortedProveedores = filteredProveedores.sort((a, b) => {
        if (a.estado === "A" && b.estado === "I") return -1;
        if (a.estado === "I" && b.estado === "A") return 1;
        return 0;
      });

      setData(sortedProveedores);
      setTablaProveedores(sortedProveedores);
      console.log(sortedProveedores);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleModificarProveedor = (index) => {
    const proveedorActual = tablaProveedores.find(
      (proveedor) => proveedor.idproveedor === index
    );

    Swal.fire({
      title: "Modificar proveedor",
      html: `<form id="form-modificar">
              <label htmlFor="nombre" style="display: block;">Nombre: </label>
              <input type="text" id="nombre" name="nombre" value="${proveedorActual.nombre_proveedor}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="mail" style="display: block;">Email: </label>
              <input type="text" id="mail" name="mail" value="${proveedorActual.mail}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="contacto" style="display: block;">Contacto: </label>
              <input type="text" id="contacto" name="contacto" value="${proveedorActual.telefono}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
            
            </form>`,
      showCancelButton: true,
      confirmButtonColor: "#1450C9",
      cancelButtonColor: "#FF3434",
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const form = document.getElementById("form-modificar");
        const idproveedor = index;
        const nuevoNombre = form.elements["nombre"].value;
        const nuevoMail = form.elements["mail"].value;
        const nuevoContacto = form.elements["contacto"].value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoRegex = /^\+549[0-9]{10}$/;

        if (!emailRegex.test(nuevoMail)) {
          Swal.fire(
            "Error",
            "Por favor, introduce un correo electronico valido",
            "error"
          );
          return;
        }

        if (!telefonoRegex.test(nuevoContacto)) {
          Swal.fire(
            "Error",
            "Por favor, introduce un número de teléfono válido de Argentina",
            "error"
          );
          return;
        }

        if (!nuevoNombre || !nuevoMail || !nuevoContacto) {
          Swal.fire("Error", "Todos los campos son obligatorios", "error");
          return;
        }

        try {
          await axios.patch(
            `http://127.0.0.1:8000/api/proveedores/${idproveedor}/`,
            {
              nombre_proveedor: nuevoNombre,
              mail: nuevoMail,
              telefono: nuevoContacto,
            }
          );

          const nuevaTablaProveedores = tablaProveedores.map((proveedor) =>
            proveedor.idproveedor === index
              ? {
                  ...proveedor,
                  nombre_proveedor: nuevoNombre,
                  mail: nuevoMail,
                  telefono: nuevoContacto,
                }
              : proveedor
          );
          setTablaProveedores(nuevaTablaProveedores);
          setData(nuevaTablaProveedores);
          Swal.fire(
            "Modificado",
            "El proveedor ha sido modificado correctamente",
            "success"
          );
        } catch (error) {
          console.error("Error al realizar la solicitud PATCH:", error);
          Swal.fire("Error", "Error al actualizar el proveedor", "error");
        }
      }
    });
  };

  const handleEliminarProveedor = async (idproveedor, proveedor) => {
    try {
      const result = await Swal.fire({
        title: `¿Estás seguro que quieres dar de baja a ${proveedor}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, dar de baja",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/proveedores/${idproveedor}/`,
          {
            estado: "I",
          }
        );

        fetchData();

        Swal.fire({
          title: "Dado de baja exitosamente!",
          text: "El proveedor ha sido eliminado.",
          icon: "success",
        });

        console.log("Solicitud PATCH exitosa", response.data);
      } else if (result.isDenied) {
        Swal.fire("Cancelado!", "", "info");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud PATCH:", error.message);
      Swal.fire("Error al dar de baja", "", "error");
    }
  };

  const handleDarAltaProveedor = async (idproveedor, proveedor) => {
    try {
      const result = await Swal.fire({
        title: `¿Estás seguro que quieres dar de alta a ${proveedor}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, dar de alta",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/proveedores/${idproveedor}/`,
          {
            estado: "A",
          }
        );

        fetchData();

        Swal.fire({
          title: "Alta de proveedor exitosa!",
          text: "El proveedor ha sido dado de alta.",
          icon: "success",
        });

        console.log("Solicitud PATCH exitosa", response.data);
      } else if (result.isDenied) {
        Swal.fire("Cancelado!", "", "info");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud PATCH:", error.message);
      Swal.fire("Error al dar de alta", "", "error");
    }
  };

  const handleEnviarWhatsapp = (telefono) => {
    const numeroTelefono = telefono.replace(/[^\d]/g, ""); // Elimina todo excepto los dígitos
    const urlWhatsapp = `https://wa.me/${numeroTelefono}`;
    window.open(urlWhatsapp, "_blank");
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: ".section-content",
          popover: {
            title: "Proveedores",
            description: "Aquí podrás ver todos los proveedores cargados",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".button-on-table-modificar",
          popover: {
            title: "Modificar",
            description:
              "Puedes cambiar algún dato del proveedor si crees necesario",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".button-on-table-alta",
          popover: {
            title: "Dar de alta",
            description:
              "Si tienes un proveedor dado de baja, puedes darlo de alta",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".button-on-table-baja",
          popover: {
            title: "Dar de baja",
            description: "También puedes darlo de baja",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".button-on-table-whatsapp",
          popover: {
            title: "Enviar whatsapp",
            description:
              "Aquí tienes un link directo para mandarle un whatsapp",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".input-search",
          popover: {
            title: "Buscar",
            description:
              "Si no encuentras lo que buscas, puedes ingresar el nombre del proveedor para encontrarlo",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-create",
          popover: {
            title: "Nuevo proveedor",
            description:
              "También puedes ir a cargar un nuevo proveedor directamente!",
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
      <h1 className="title">Proveedores</h1>
      <div className="search-box">
        <CustomTextField value={busqueda} onChange={handleChange} />

        <button className="btn-create" onClick={navegarANuevoProveedor}>+ Nuevo proveedor</button>
      </div>
      <TableContainer class="table-container-format" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("nombre_proveedor")}
              >
                Nombre{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell class="cell-head-TableContainer">Mail</TableCell>
              <TableCell class="cell-head-TableContainer">Contacto</TableCell>
              <TableCell
                class="cell-head-TableContainer clickeable"
                onClick={() => handleOrdenar("estado")}
              >
                Estado{" "}
                <FontAwesomeIcon icon={faSort} style={{ color: "#000000" }} />
              </TableCell>
              <TableCell
                class="cell-head-TableContainer"
                colSpan={3}
                style={{ textAlign: "center" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedoresOrdenados.map((row) => (
              <TableRow key={row.idproveedor}>
                <TableCell>{row.nombre_proveedor}</TableCell>
                <TableCell>{row.mail}</TableCell>
                <TableCell>{row.telefono}</TableCell>
                <TableCell>
                  {row.estado === "A" ? "Activo" : "Inactivo"}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="button-on-table-modificar"
                    onClick={() => handleModificarProveedor(row.idproveedor)}
                  >
                    Modificar
                  </button>
                </TableCell>
                <TableCell>
                  {row.estado === "A" ? (
                    <button
                      type="button"
                      className="button-on-table-baja"
                      onClick={() =>
                        handleEliminarProveedor(
                          row.idproveedor,
                          row.nombre_proveedor
                        )
                      }
                    >
                      Dar de Baja
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button-on-table-alta"
                      onClick={() =>
                        handleDarAltaProveedor(
                          row.idproveedor,
                          row.nombre_proveedor
                        )
                      }
                    >
                      Dar de Alta
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="button-on-table-whatsapp"
                    onClick={() => handleEnviarWhatsapp(row.telefono)}
                  >
                    Enviar WhatsApp
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
