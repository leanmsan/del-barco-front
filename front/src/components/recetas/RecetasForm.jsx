import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import { TextField, InputAdornment, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

export function RecetasForm() {
  const [nombreReceta, setNombreReceta] = useState("");
  const [errorNombreReceta, setErrorNombreReceta] = useState(false);

  const [tipoReceta, setTipoReceta] = useState("");
  const [errorTipoReceta, setErrorTipoReceta] = useState(false);

  const [litrosReceta, setLitrosReceta] = useState("");
  const [errorLitrosReceta, setErrorLitrosReceta] = useState(false);

  const [insumoId, setInsumoId] = useState("");
  const [errorInsumoId, setErrorInsumoId] = useState(false);
  const [seleccionarInsumo, setSeleccionarInsumo] = useState([]);

  const [cantidad, setCantidad] = useState("");
  const [errorCantidad, setErrorCantidad] = useState(false);

  const [tipoMedida, setTipoMedida] = useState("");
  const [errorTipoMedida, setErrorTipoMedida] = useState(false);

  const [listaDetalles, setListaDetalles] = useState([]);
  const [errorListaDetalles, setErrorListaDetalles] = useState(false);

  const [listaInsumos, setListaInsumos] = useState([]);
  const [errorListaInsumos, setErrorListaInsumos] = useState(false);

  const [editable, setEditable] = useState(true);

  const navegate = useNavigate();

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/insumos/");
      const data = await response.json();
      setListaInsumos(data.insumos);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };

  // Función para validar nombre y tipo
  function validaNombreYTipo(nombre, tipo) {
    // Agrega tu lógica de validación aquí
    // Devuelve verdadero si es válido, falso en caso contrario
    if (nombre.trim() === "" || tipo.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor, completa el nombre y estilo correctamente.",
      });
      if (nombre.trim() === "") {
        setErrorNombreReceta(true);
      }
      if (tipo.trim() === "") {
        setErrorTipoReceta(true);
      }
      return false;
    } else {
      if (editable === true) {
        Swal.fire({
          icon: "success",
          title: "Nombre y estilos cargados correctamente",
          text: "Por favor, continua con los insumos.",
        });
      }
      if (nombre.trim() != "") {
        setErrorNombreReceta(false);
      }
      if (tipo.trim() != "") {
        setErrorTipoReceta(false);
      }
      return true;
    }
  }

  // Funcion para validar litros
  function validaLitros(litros) {
    // Agrega tu lógica de validación aquí
    // Devuelve verdadero si es válido, falso en caso contrario
    if (litros.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor, completa los litros correctamente.",
      });
      if (litros.trim() === "") {
        setErrorLitrosReceta(true);
      }
      return false;
    }
    return true;
  }

  // Función para validar insumo y cantidad
  function validaInsumoYCantidad(insumo, cantidad) {
    // Agrega tu lógica de validación aquí
    // Devuelve verdadero si es válido, falso en caso contrario
    if (insumo.trim() === "" || cantidad.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor, completa el insumo y la cantidad correctamente.",
      });
      if (insumo.trim() === "") {
        setErrorInsumoId(true);
      }
      if (cantidad.trim() === "") {
        setErrorCantidad(true);
      }
      return false;
    } else {
      return true;
    }
  }

  // Función para validar la lista de detalles
  function validaDetalles(detalles) {
    // Agrega tu lógica de validación aquí
    // Devuelve verdadero si es válido, falso en caso contrario
    if (detalles.length != 0) {
      return true;
    } else {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor, ingresa al menos un insumo de receta.",
      });
      return false;
    }
  }

  // Función para validar el formulario
  function validaFormulario(nombre, tipo, detalles, litros) {
    return validaNombreYTipo(nombre, tipo) && validaDetalles(detalles) && validaLitros(litros);
  }

  const validarFormulario = () => {
    if (!validaFormulario(nombreReceta, tipoReceta, listaDetalles, litrosReceta)) {
      return false;
    } else {
      return true;
    }
  };

  const handleNombreRecetaChange = (e) => {
    setNombreReceta(e.target.value);
    setErrorNombreReceta(false);
  };

  const handleTipoRecetaChange = (e) => {
    setTipoReceta(e.target.value);
    setErrorTipoMedida(false);
  };

  const handleLitrosChange = (e) => {
    setLitrosReceta(e.target.value);
    setErrorLitrosReceta(false);
  };

  const handleInsumoIdChange = (e) => {
    setInsumoId(e.target.value);
    setErrorInsumoId(false);

    const auxInsumo = e.target.value;

    const selectedInsumo = listaInsumos.find(
      (insumo) => insumo.nombre_insumo === auxInsumo
    );

    setTipoMedida(selectedInsumo.tipo_medida);
    setErrorTipoMedida(false);
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
    setErrorCantidad(false);
  };

  const handleTipoMedidaChange = (e) => {
    setTipoMedida(e.target.value);
    setErrorTipoMedida(false);
  };

  const handleAgregarDetalle = () => {
    if (validaInsumoYCantidad(insumoId, cantidad)) {
      // Validar que la cantidad no esté vacía o sea cero
      if (parseFloat(cantidad) > 0) {
        const nuevoDetalle = {
          insumoId: insumoId,
          cantidad: cantidad,
          tipoMedida: tipoMedida,
        };
        const detalleExistente = listaDetalles.find(
          (detalle) => detalle.insumoId === nuevoDetalle.insumoId
        );
        if (detalleExistente) {
          const cantidadActual = parseFloat(detalleExistente.cantidad);
          const cantidadTotal =
            cantidadActual + parseFloat(nuevoDetalle.cantidad);
          Swal.fire({
            title: "El insumo ya se encuentra en la lista",
            text: `El insumo ${detalleExistente.insumoId} ya está en la lista. La cantidad actual es ${cantidadActual}, quieres agregar ${cantidad}, lo que haría un total de ${cantidadTotal}. ¿Quieres agregarlo?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, agregar",
            cancelButtonText: "No, cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              const suma = parseFloat(detalleExistente.cantidad) + parseFloat(cantidad);
              
              // Mapea la lista y reemplaza el detalle existente con el detalle actualizado
              const nuevaListaDetalles = listaDetalles.map(detalle =>
                detalle.insumoId === detalleExistente.insumoId ? { ...detalle, cantidad: suma } : detalle
              );

              // Actualiza el estado con la nueva lista
              setListaDetalles(nuevaListaDetalles);

            }
          });
        } else {
          setListaDetalles([...listaDetalles, nuevoDetalle]);
        }

        setInsumoId("");
        setCantidad("");
        setTipoMedida("");
      } else {
        setErrorCantidad(true);

        Swal.fire({
          icon: "error",
          title: "Cantidad inválida",
          text: "La cantidad debe ser mayor a cero",
        });
      }
    } else {
      setErrorCantidad(true);
      setErrorInsumoId(true);

      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Todos los campos de detalle son obligatorios",
      });
    }
  };

  const handleQuitarDetalle = (index) => {
    const nuevasDetalles = [...listaDetalles];
    nuevasDetalles.splice(index, 1);
    setListaDetalles(nuevasDetalles);
  };

  const handleNombreTipo = () => {
    // Puedes agregar lógica adicional aquí antes de deshabilitar la edición
    // Si el formulario no es válido, no deshabilitar la edición
    if (!validaNombreYTipo(nombreReceta, tipoReceta) && !validaLitros(litrosReceta)) {
      return;
    }
    setEditable(!editable);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const recetasApiUrl = "http://127.0.0.1:8000/api/recetas/";
    const recetasDetallesApiUrl = "http://127.0.0.1:8000/api/receta_detalles/";

    const recetasData = {
      nombre_receta: nombreReceta,
      tipo: tipoReceta,
      litros: litrosReceta,
    };

    try {
      const recetasResponse = await fetch(recetasApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recetasData),
      });

      const recetasResult = await recetasResponse.json();

      if (recetasResponse.ok) {
        // Receta creada con éxito, ahora agregar detalles
        const recetaId = recetasResult.last_inserted_receta;

        const promises = listaDetalles.map(async (detalle, index) => {
          const recetasDetallesData = {
            receta_id: recetaId,
            insumo_id: detalle.insumoId,
            cantidad: detalle.cantidad,
            tipo_medida: detalle.tipoMedida,
          };

          const recetasDetallesResponse = await fetch(recetasDetallesApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(recetasDetallesData),
          });

          return recetasDetallesResponse.json();
        });

        const detallesResults = await Promise.all(promises);

        Swal.fire({
          icon: "success",
          title: "Receta creada con éxito",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navegate("/recetas");
        });

        // Limpiar formulario después del envío exitoso
        setNombreReceta("");
        setTipoReceta("");
        setLitrosReceta("");
        setInsumoId("");
        setCantidad("");
        setTipoMedida("");
        setListaDetalles([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al crear la receta",
          text: "Ya existe una receta con ese nombre",
        });
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: ".section-content-form",
          popover: {
            title: "Nueva receta",
            description: "Aquí podrás cargar los datos de una nueva receta",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".campos",
          popover: {
            title: "Datos",
            description:
              "En los campos vas cargando los datos de la nueva receta y de los insumos",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".nombre-tipo",
          popover: {
            title: "Nombre y estilo de cerveza",
            description:
              "En estos campos cargas el nombre y estilo de la cerveza",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-nombre-tipo",
          popover: {
            title: "Confirmar nombre y estilo",
            description:
              "Una vez cargados el nombre y estilo de la cerveza, presiona aquí para confirmarlos. TIP: Si te equivocaste, puedes volver a editarlos",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".insumo-cantidad",
          popover: {
            title: "Insumo y cantidad",
            description:
              "En estos campos cargas el insumo y la cantidad que lleva la receta",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-agregar",
          popover: {
            title: "Agregar insumo",
            description:
              "Cuando tengas los datos cargados de un insumo, presiona aquí para agregarlo a la lista de insumos",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".tabla-detalles",
          popover: {
            title: "Lista de insumos",
            description: "Aqui se verán los insumos que vas cargando",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".button-on-table-baja",
          popover: {
            title: "Quitar de la lista",
            description:
              "Cuando tengas insumos cargados te aparecerá el boton para quitarlo, en caso de que te hayas confundido",
          },
        },
        {
          element: ".btn-guardar",
          popover: {
            title: "Registrar receta",
            description:
              "Una vez cargados el nombre, el tipo y los insumos, presiona el botón para registrar la receta",
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
    <div className="section-content-form">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="title">Nueva receta</h1>
        <div className="campos">
          <div className="nombre-tipo" style={{alignItems: "center"}}>
            <div className="nombre-tipo-form">
              <TextField
                required
                id="outlined-required"
                label="Nombre de cerveza"
                type="text"
                value={nombreReceta}
                onChange={handleNombreRecetaChange}
                error={errorNombreReceta}
                helperText={
                  errorNombreReceta ? "El nombre de cerveza es requerido" : ""
                }
                InputProps={{
                  readOnly: !editable, // Establecer readOnly en función del estado editable
                }}
              />

              <TextField
                required
                id="outlined-required"
                label="Estilo de cerveza"
                type="text"
                value={tipoReceta}
                onChange={handleTipoRecetaChange}
                error={errorTipoReceta}
                helperText={
                  errorTipoReceta ? "El estilo de cerveza es requerido" : ""
                }
                InputProps={{
                  readOnly: !editable, // Establecer readOnly en función del estado editable
                }}
              />

              <TextField
                required
                id="outlined-required"
                label="Litros"
                type="number"
                value={litrosReceta}
                onChange={handleLitrosChange}
                error={errorLitrosReceta}
                helperText={
                  errorLitrosReceta ? "Los litros de cerveza es requerido" : ""
                }
                InputProps={{
                  readOnly: !editable, // Establecer readOnly en función del estado editable
                }}
              />
            </div>

            
            <button
              className="button-guardar btn-nombre-tipo"
              type="button"
              onClick={handleNombreTipo}
              style={{margin: "0"}}
            >
              {editable ? "Fijar nombre" : "Editar"}
            </button>
          </div>

          <div className="insumo-cantidad">
            <div className="insumo-cantidad-form">
              <TextField
                required
                id="outlined-select-currency"
                select
                label="Insumo"
                type="text"
                value={insumoId}
                onChange={handleInsumoIdChange}
                error={errorInsumoId}
                helperText={
                  errorInsumoId ? "Tienes que seleccionar un insumo" : ""
                }
              >
                <MenuItem value="" disabled>
                  Selecciona un insumo
                </MenuItem>
                {listaInsumos.map((insumo) => (
                  <MenuItem key={insumo.insumo_id} value={insumo.nombre_insumo}>
                    {insumo.nombre_insumo}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                id="outlined-number"
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => {
                  setCantidad(e.target.value);
                  setErrorCantidad(false);
                }}
                error={errorCantidad}
                helperText={errorCantidad ? "La cantidad es requerida" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">{tipoMedida}</InputAdornment>
                  ),
                }}
              />
            </div>
            <button
              className="button-guardar btn-agregar"
              type="button"
              onClick={handleAgregarDetalle}
              style={{margin: "0"}}
            >
              Agregar insumo
            </button>
          </div>
          <br />
        </div>
        <h2 className="subtitulo-tablas">Lista de insumos</h2>
        {listaDetalles.length >= 0 && (
          <div>
            <TableContainer
              class="table-container-format tabla-detalles"
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
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell class="cell-head-TableContainer">
                      Insumo
                    </TableCell>
                    <TableCell class="cell-head-TableContainer">
                      Cantidad
                    </TableCell>
                    {/* <TableCell class="cell-head-TableContainer">
                      Tipo Medida
                    </TableCell> */}
                    <TableCell
                      class="cell-head-TableContainer"
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaDetalles.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>{detalle.insumoId}</TableCell>
                      <TableCell>
                        {detalle.cantidad} {detalle.tipoMedida}
                      </TableCell>
                      {/* <TableCell>{detalle.tipoMedida}</TableCell> */}

                      <TableCell>
                        <button
                          type="button"
                          className="button-on-table-baja"
                          onClick={() => handleQuitarDetalle(index)}
                        >
                          Quitar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <button className="button-guardar btn-guardar" type="submit">
          Registrar receta
        </button>
      </Box>
      <div className="btn-ayuda">
        <button onClick={driverAction} className="button-ayuda">
          <FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff" }} />
        </button>
      </div>
    </div>
  );
}
