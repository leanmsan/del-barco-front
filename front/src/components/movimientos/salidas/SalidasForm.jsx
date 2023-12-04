import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { TextField, InputAdornment } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import RequiredFieldError from "../../../utils/errors";
import { useNavigate } from "react-router-dom";

// imports para la tabla con los insumos que componen el detalle
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

export function SalidasForm() {
  // salida
  const [fecha_salida, setFechaSalida] = useState("");
  const [errorFecha, setErrorFecha] = useState(false);

  const [monto_total, setMontoTotal] = useState(0);

  // salida detalle
  const [idsalida_id, setIdSalidaId] = useState("");

  const [seleccionarInsumo, setSeleccionarInsumo] = useState([]);

  const [insumo_id, setInsumoId] = useState("");
  const [errorInsumoId, setErrorInsumoId] = useState(false);

  const [cantidad, setCantidad] = useState("");
  const [errorCantidad, setErrorCantidad] = useState(false);

  const [listaDetalle, setListaDetalle] = useState([]);

  const navegate = useNavigate();
  // listado de insumos
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

  // obtenemos el ultimo id insertado en la tabla entrada
  useEffect(() => {
    const fetchLastInsertedId = async () => {
      try {
        // Realiza una solicitud a la API de entradas para obtener todas las entradas
        const response = await fetch("http://127.0.0.1:8000/api/lastidsalida/");
        const data = await response.json();
        //console.log('Esto es data', data);
        const lastId = data.lastid + 1;
        //console.log('Esto es ultimo id', lastId);

        if (response.ok) {
          setIdSalidaId(lastId);
        } else {
          console.log("Error al obtener el último id de entrada", response);
        }
      } catch (error) {
        console.log("Error de red", error);
      }
    };

    fetchLastInsertedId();
  }, []);

  const salidaDetalleFormRef = useRef(null);

  const isPositiveNumber = (value) => {
    return !isNaN(value) && value > 0;
  };

  const validateSalidasFields = () => {
    if (!insumo_id || !cantidad) {
      if (!insumo_id) {
        setErrorInsumoId(true);
      }
      if (!cantidad) {
        setErrorCantidad(true);
      }

      const cantidadNumero = parseFloat(cantidad);

      if (!isPositiveNumber(cantidadNumero)) {
        if (!isPositiveNumber(cantidadNumero)) {
          setErrorCantidad(true);
        }

        throw new RequiredFieldError("Cantidad deben ser números positivos");
      }
      throw new RequiredFieldError(
        "Todos los campos del detalle son obligatorios"
      );
    }

    // Verificación adicional para asegurar que tanto cantidad como precio_unitario sean positivos
    if (parseFloat(cantidad) <= 0) {
      setErrorCantidad(true);
      throw new RequiredFieldError("Cantidad deben ser números positivos");
    }
  };

  const agregarDetalle = () => {
    try {
      validateSalidasFields();

      const insumoExistente = listaDetalle.some(
        (detalle) => detalle.insumo_id === insumo_id
      );

      if (insumoExistente) {
        Swal.fire({
          title: "Error",
          text: "El insumo ya está en la lista",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new RequiredFieldError("El insumo ya está en la lista");
      }

      const nuevoDetalle = {
        idsalida_id: idsalida_id,
        insumo_id: insumo_id,
        cantidad: cantidad,
      };

      const subtotal = parseFloat(cantidad);
      const nuevoTotal = monto_total + subtotal;

      setListaDetalle([...listaDetalle, nuevoDetalle]);
      setMontoTotal(nuevoTotal);

      setInsumoId("");
      setCantidad("");

      setInsumoId("");
      setCantidad("");

      if (salidaDetalleFormRef.current) {
        salidaDetalleFormRef.current.reset();
        setErrorInsumoId(false);
        setErrorCantidad(false);
      }
    } catch (error) {
      if (error instanceof RequiredFieldError) {
        console.log("Faltan completar datos requeridos", error.message);
      } else {
        console.log("Error de red", error);
      }
    }
  };

  const handleQuitarDetalle = (index) => {
    const nuevasDetalles = [...listaDetalle];
    nuevasDetalles.splice(index, 1);
    setListaDetalle(nuevasDetalles);
  };

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const salida = {
      fecha_salida,
      monto_total,
    };

    try {
      if (!fecha_salida) {
        setErrorFecha(!fecha_salida);
        throw new RequiredFieldError("Este campo es obligatorio");
      }

      const response = await fetch("http://127.0.0.1:8000/api/salidas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salida),
      });

      if (response.ok) {
        const data = await response.json();
        setIdSalidaId(data.id);
        setErrorFecha(false);
        setMontoTotal(0);
        setListaDetalle([]);
      } else {
        console.log("Error al crear la entrada", response);
        return;
      }

      // Envía detalles de entrada
      const promises = listaDetalle.map((detalle) =>
        fetch("http://127.0.0.1:8000/api/salida_detalles/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detalle),
        })
      );

      // Espera a que se completen todas las solicitudes
      console.log(promises);
      await Promise.all(promises);

      Swal.fire({
        title: "Éxito",
        text: "La salida se registró correctamente!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navegate("/salidas");
      });

      console.log("Entrada y detalles creados exitosamente");
    } catch (error) {
      console.log("Error de red", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar el formulario",
        icon: "error",
        confirmButtonText: "OK",
      });
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
            title: "Nuevo egreso",
            description:
              "Aquí podrás cargar los datos de los insumos que salieron",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".campos",
          popover: {
            title: "Datos",
            description: "En los campos vas cargando los datos de los insumos",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-agregar",
          popover: {
            title: "Agregar insumo",
            description:
              "Cuando tengas los datos cargados de un insumo, presiona aquí",
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
          popover: {
            title: "Quitar de la lista",
            description:
              "Cuando cargues insumos te aparecerá el boton para quitarlo, en caso de que te hayas confundido",
          },
        },
        {
          element: ".btn-guardar",
          popover: {
            title: "Guardar",
            description:
              "Una vez cargados los datos, presiona Guardar para registrarlo",
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
        <h1 className="title">Nuevo egreso</h1>
        <div className="campos">
          <TextField
            required
            id="outlined-required"
            label="Fecha"
            type="date"
            InputLabelProps={{
              shrink: true, // Esto evita la superposición del label
            }}
            value={fecha_salida}
            onChange={(e) => {
              setFechaSalida(e.target.value);
              setErrorFecha(false);
            }}
            error={errorFecha}
            helperText={errorFecha ? "La fecha es requerida" : ""}
          />

          <TextField
            required
            id="outlined-select-currency"
            select
            label="Insumo"
            type="text"
            value={insumo_id}
            onChange={(e) => {
              setInsumoId(e.target.value);
              setErrorInsumoId(false);
            }}
            error={errorInsumoId}
            helperText={errorInsumoId ? "Tienes que seleccionar un insumo" : ""}
          >
            <MenuItem value="" disabled>
              Selecciona un insumo
            </MenuItem>
            {seleccionarInsumo.map((insumo) => (
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
                <InputAdornment position="end">
                  {
                    seleccionarInsumo.find(
                      (insumo) => insumo.nombre_insumo === insumo_id
                    )?.tipo_medida
                  }
                </InputAdornment>
              ),
            }}
          />

          <br />
        </div>
        <button
          className="button-guardar btn-agregar"
          type="button"
          onClick={agregarDetalle}
        >
          Agregar insumo
        </button>
        <h2 className="subtitulo-tablas">Lista de insumos</h2>
        {/* Tabla con los insumos en el detalle */}
        <TableContainer
          class="table-container-format tabla-detalles"
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Insumo</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listaDetalle.map((detalle, index) => (
                <TableRow key={detalle.identrada_id}>
                  <TableCell>{detalle.insumo_id}</TableCell>
                  <TableCell>{detalle.cantidad} {seleccionarInsumo.find(
                      (insumo) => insumo.nombre_insumo === detalle.insumo_id
                    )?.tipo_medida}</TableCell>
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
        <button className="button-guardar btn-guardar" type="submit">
          Guardar
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
