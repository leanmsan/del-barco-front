import { useEffect, useRef, useState } from "react";
import RequiredFieldError from "../../../utils/errors";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { TextField, InputAdornment } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

export function EntradaForm() {
  // entrada
  const [proveedor_id, setProveedorId] = useState("");
  const [errorProveedor, setErrorProveedor] = useState(false);

  const [proveedores, setProveedores] = useState([]);

  const [fecha_entrada, setFechaEntrada] = useState("");
  const [errorFecha, setErrorFecha] = useState(false);

  const [monto_total, setMontoTotal] = useState(0);

  // entrada detalle
  const [identrada_id, setIdEntradaId] = useState("");

  const [seleccionarInsumo, setSeleccionarInsumo] = useState([]);

  const [insumo_id, setInsumoId] = useState("");
  const [errorInsumoId, setErrorInsumoId] = useState(false);

  const [cantidad, setCantidad] = useState("");
  const [errorCantidad, setErrorCantidad] = useState(false);

  const [precio_unitario, setPrecioUnitario] = useState("");
  const [errorPrecioUnitario, setErrorPrecioUnitario] = useState(false);

  const [listaDetalle, setListaDetalle] = useState([]);

  const navegate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/proveedores/");
        const data = await response.json();

        if (response.ok) {
          setProveedores(data.proveedores);
        } else {
          console.log("Error al obtener los proveedores", response);
        }
      } catch (error) {
        console.log("Error de red", error);
      }
    };

    fetchProveedores();
  }, []);

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

  useEffect(() => {
    const fetchLastInsertedId = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/lastidentrada/"
        );
        const data = await response.json();
        const lastId = data.lastid + 1;

        if (response.ok) {
          setIdEntradaId(lastId);
        } else {
          console.log("Error al obtener el último id de entrada", response);
        }
      } catch (error) {
        console.log("Error de red", error);
      }
    };

    fetchLastInsertedId();
  }, []);

  const entradaDetalleFormRef = useRef(null);

  const isPositiveNumber = (value) => {
    return !isNaN(value) && value > 0;
  };
  const validateDetalleFields = () => {
    if (!insumo_id || !cantidad || !precio_unitario) {
      if (!insumo_id) {
        setErrorInsumoId(true);
      }
      if (!cantidad) {
        setErrorCantidad(true);
      }
      if (!precio_unitario) {
        setErrorPrecioUnitario(true);
      }

      const cantidadNumero = parseFloat(cantidad);
      const precioNumero = parseFloat(precio_unitario);

      if (
        !isPositiveNumber(cantidadNumero) ||
        !isPositiveNumber(precioNumero)
      ) {
        if (!isPositiveNumber(cantidadNumero)) {
          setErrorCantidad(true);
        }
        if (!isPositiveNumber(precioNumero)) {
          setErrorPrecioUnitario(true);
        }

        throw new RequiredFieldError(
          "Cantidad y precio unitario deben ser números positivos"
        );
      }
      throw new RequiredFieldError(
        "Todos los campos del detalle son obligatorios"
      );
    }

    // Verificación adicional para asegurar que tanto cantidad como precio_unitario sean positivos
    if (parseFloat(cantidad) <= 0 || parseFloat(precio_unitario) <= 0) {
      setErrorCantidad(true);
      setErrorPrecioUnitario(true);
      throw new RequiredFieldError(
        "Cantidad y precio unitario deben ser números positivos"
      );
    }
  };

  const agregarDetalle = () => {
    try {
      validateDetalleFields();

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
        identrada_id: identrada_id,
        insumo_id: insumo_id,
        cantidad: cantidad,
        precio_unitario: precio_unitario,
      };

      const subtotal = nuevoDetalle.cantidad * nuevoDetalle.precio_unitario;
      var nuevoTotal = monto_total || 0;
      nuevoTotal = nuevoTotal + subtotal;

      setListaDetalle([...listaDetalle, nuevoDetalle]);
      setMontoTotal(nuevoTotal);

      setInsumoId("");
      setCantidad("");
      setPrecioUnitario("");

      if (entradaDetalleFormRef.current) {
        entradaDetalleFormRef.current.reset();
        setErrorInsumoId(false);
        setErrorCantidad(false);
        setErrorPrecioUnitario(false);
      }
    } catch (error) {
      if (error instanceof RequiredFieldError) {
        console.log("Faltan completar datos requeridos", error.message);
      } else {
        console.log("Error de red", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!proveedor_id || !fecha_entrada) {
        setErrorProveedor(true);
        setErrorFecha(true);
        throw new RequiredFieldError("Este campo es obligatorio");
      }

      if (listaDetalle.length === 0) {
        setErrorInsumoId(true);
        setErrorCantidad(true);
        setErrorPrecioUnitario(true);
        console.log("Debes agregar al menos un detalle.");
        throw new RequiredFieldError("Debes agregar al menos un detalle");
      }

      agregarDetalle();

      const entrada = {
        proveedor_id,
        fecha_entrada: fecha_entrada,
        monto_total,
      };

      const response = await fetch("http://127.0.0.1:8000/api/entradas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entrada),
      });

      if (response.ok) {
        const data = await response.json();
        setIdEntradaId(data.id);
        setErrorProveedor(false);
        setErrorFecha(false);
        setProveedorId("");
        setMontoTotal(0);
        setListaDetalle([]);
      } else {
        console.log("Error al crear la entrada", response);
        return;
      }

      const promises = listaDetalle.map((detalle) =>
        fetch("http://127.0.0.1:8000/api/entrada_detalles/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detalle),
        })
      );

      await Promise.all(promises);

      Swal.fire({
        title: "Éxito",
        text: "La entrada se registró correctamente!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        console.log("redireccion a la tabla entradas");
        navegate("/entradas");
      });

      console.log("Entrada y detalles creados exitosamente");
    } catch (error) {
      if (error instanceof RequiredFieldError) {
        console.log("Error de validación", error.message);
      } else {
        console.log("Error de red", error);
      }

      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar el formulario",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const renderInsumos = () => {
    return (
      <>
        <h2 className="subtitulo-tablas">Lista de insumos</h2>
        <TableContainer
          class="table-container-format tabla-detalles"
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell class="cell-head-TableContainer">Insumo</TableCell>
                <TableCell class="cell-head-TableContainer">Cantidad</TableCell>
                <TableCell class="cell-head-TableContainer">Precio Unitario</TableCell>
                <TableCell class="cell-head-TableContainer">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listaDetalle.map((detalle, index) => (
                <TableRow key={detalle.identrada_id}>
                  <TableCell>{detalle.insumo_id}</TableCell>
                  <TableCell>{`${detalle.cantidad} ${seleccionarInsumo.find((insumo) => insumo.nombre_insumo === detalle.insumo_id)?.tipo_medida}`}</TableCell>
                  <TableCell>{detalle.precio_unitario}</TableCell>
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
      </>
    );
  };

  const handleQuitarDetalle = (index) => {
    const detalleToRemove = listaDetalle[index];
    const subtotal = detalleToRemove.cantidad * detalleToRemove.precio_unitario;

    const nuevasDetalles = [...listaDetalle];
    nuevasDetalles.splice(index, 1);
    setListaDetalle(nuevasDetalles);

    const nuevoTotal = monto_total - subtotal;
    setMontoTotal(nuevoTotal);
  };

  const insumoSeleccionado = seleccionarInsumo.find(
    (insumo) => insumo.nombre_insumo === insumo_id
  );

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: ".section-content-form",
          popover: {
            title: "Nuevo ingreso",
            description:
              "Aquí podrás cargar los datos de los insumos que ingresan",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".proveedor-fecha",
          popover: {
            title: "Datos de proveedor y fecha",
            description: "Aqui seleccionas el proveedor al que le compraste y la fecha de ingreso. TIP: recuerda tener cargado el proveedor antes de crear un ingreso",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".insumos-cantidad-precio",
          popover: {
            title: "Datos de insumos",
            description: "Aquí debes seleccionar el insumo, la cantidad y el precio unitario. TIP: recuerda tener cargado el insumo antes de crear un ingreso",
            side: "right",
            align: "start",
          },
        },
        {
          element: ".btn-agregar",
          popover: {
            title: "Agregar insumo",
            description:
              "Cuando tengas los datos cargados de un insumo, presiona aquí para añadirlo a la lista",
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
          element: ".monto",
          popover: {
            title: "Monto total",
            description:
              "Aquí se irá actualizando con el monto total de los ingresos.",
            side: "left",
            align: "start",
          },
        },
        {
          element: ".button-on-table-baja",
          popover: {
            title: "Quitar de la lista",
            description:
              "Cuando cargues insumos te aparecerá el boton para quitarlo, en caso de que te hayas confundido",
              side: "left",
              align: "start",
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
        <h1 className="title">Nuevo ingreso</h1>
        <div className="campos">
          <div className="proveedor-fecha">
            <TextField
              required
              id="outlined-select-currency"
              select
              label="Proveedor"
              value={proveedor_id}
              onChange={(e) => {
                setProveedorId(e.target.value);
                setErrorProveedor(false);
              }}
              error={errorProveedor}
              helperText={errorProveedor && "El proveedor es requerido"}
            >
              <MenuItem value="" disabled>
                Selecciona un proveedor
              </MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem
                  key={proveedor.idproveedor}
                  value={proveedor.nombre_proveedor}
                >
                  {proveedor.nombre_proveedor}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              id="outlined-required"
              label="Fecha"
              type="date"
              InputLabelProps={{
                shrink: true, // Esto evita la superposición del label
              }}
              value={fecha_entrada}
              onChange={(e) => {
                setFechaEntrada(e.target.value);
                setErrorFecha(false);
              }}
              error={errorFecha}
              helperText={errorFecha ? "La fecha es requerida" : ""}
            />
          </div>
          <br />
          <div className="insumos-cantidad-precio">
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

            <TextField
              required
              id="outlined-number"
              label={
                insumoSeleccionado
                  ? `Precio unitario por ${insumoSeleccionado.tipo_medida}`
                  : "Precio unitario"
              }
              type="number"
              value={precio_unitario}
              onChange={(e) => {
                setPrecioUnitario(e.target.value);
                setErrorPrecioUnitario(false);
              }}
              error={errorPrecioUnitario}
              helperText={
                errorPrecioUnitario ? "El precio unitario es requerido" : ""
              }
            />
          </div>

          <br />
        </div>
        <button
          className="button-guardar btn-agregar"
          type="button"
          onClick={agregarDetalle}
        >
          Agregar insumo
        </button>

        {renderInsumos()}

        <div className="monto">
          <TextField
            id="outlined-read-only-input"
            label="Monto Total"
            value={monto_total}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
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