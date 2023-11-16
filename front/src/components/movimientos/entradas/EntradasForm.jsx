import { useEffect, useRef, useState } from "react";
import "../../../css/form.css";
import RequiredFieldError from "../../../utils/errors";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom";

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

    const navegate = useNavigate()

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
                const response = await fetch("http://127.0.0.1:8000/api/lastidentrada/");
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

    const agregarDetalle = () => {
        try {
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

                if (!isPositiveNumber(cantidadNumero) || !isPositiveNumber(precioNumero)) {
                    if (!isPositiveNumber(cantidadNumero)) {
                        setErrorCantidad(true)
                    }
                    if (!isPositiveNumber(precioNumero)) {
                        setErrorPrecioUnitario(true);
                    }

                    throw new RequiredFieldError('Cantidad y precio unitario deben ser números positivos');
                }

                throw new RequiredFieldError('Todos los campos del detalle son obligatorios');
            } else { 
                const insumoExistente = listaDetalle.some(
                    (detalle) => detalle.insumo_id === insumo_id
                );

                if (insumoExistente) {
                    //console.log("El insumo ya está en la lista de detalles");
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
          }
          else {
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
            title: 'Éxito',
            text: 'La entrada se registró correctamente!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            console.log('redireccion a la tabla entradas')
            navegate('/entradas')
          })
      
          console.log("Entrada y detalles creados exitosamente");
        } catch (error) {
          if (error instanceof RequiredFieldError) {
            console.log('Error de validación', error.message);
          } else {
            console.log("Error de red", error);
          }
      
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar el formulario',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      };      

    return (
        <div className="section-content-form">
            {/* <form
                ref={entradaDetalleFormRef}
                id="EntradaDetalle"
                className="form"
                onSubmit={handleSubmit}
            >
                <h1 className="title">Nueva entrada</h1>
                <div className="input-control">
                    <label>
                        Proveedor
                        <select
                            value={proveedor_id}
                            onChange={(e) => {
                                setProveedorId(e.target.value);
                                setErrorProveedor(false);
                            }}
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option
                                    key={proveedor.idproveedor}
                                    value={proveedor.nombre_proveedor}
                                >
                                    {proveedor.nombre_proveedor}
                                </option>
                            ))}
                        </select>
                        {errorProveedor && (
                            <div className="error-message">Tienes que selecciona un proveedor</div>
                        )}
                    </label>
                    <label>
                        Fecha
                        <input
                            type="date"
                            name="fecha"
                            onChange={(e) => {
                                setFechaEntrada(e.target.value);
                                setErrorFecha(false);
                            }}
                        />
                        {errorFecha && (
                            <div className="error-message">Tienes que seleccionar una fecha</div>
                        )}
                    </label>
                    <label>Monto Total</label>
                    <p>{monto_total}</p>
                </div>

                <div className="input-control">
                    <label name="insumo_id">Insumo
                        <select
                            value={insumo_id}
                            onChange={(e) => {
                                setInsumoId(e.target.value);
                                setErrorInsumoId(false);
                            }}
                        >
                            <option value="">Seleccione un insumo</option>
                            {seleccionarInsumo.map((insumo) => (
                                <option
                                    key={insumo.insumo_id}
                                    value={insumo.nombre_insumo}
                                >
                                    {insumo.nombre_insumo}
                                </option>
                            ))}
                        </select>
                        {errorInsumoId && (
                            <div className="error-message">Tienes que seleccionar un insumo</div>
                        )}
                    </label>
                    <label>Cantidad
                        <input
                            type="number"
                            name="cantidad"
                            onChange={(e) => {
                                setCantidad(e.target.value);
                                setErrorCantidad(false);
                            }}
                        />
                        {errorCantidad && (
                            <div className="error-message">Tienes que especificar la cantidad</div>
                        )}
                    </label>
                    <label>Precio Unitario
                        <input
                            type="number"
                            name="precio_unitario"
                            onChange={(e) => {
                                setPrecioUnitario(e.target.value);
                                setErrorPrecioUnitario(false);
                            }}
                        />
                        {errorPrecioUnitario && (
                            <div className="error-message">Tienes que especificar el precio</div>
                        )}
                    </label>
                </div>
                <button
                    className="button"
                    type="button"
                    onClick={agregarDetalle}
                    style={{
                        padding: "5px",
                        color: "white",
                        backgroundColor: "#7e530f",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                    }}
                >
                    Agregar insumo
                </button>

                <TableContainer style={{ margin: "10px 20px 0 0", padding: "5px 5px 5px 5px", }} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Insumo</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Unitario</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaDetalle.map((detalle) => (
                                <TableRow key={detalle.identrada_id}>
                                    <TableCell>{detalle.insumo_id}</TableCell>
                                    <TableCell>{detalle.cantidad}</TableCell>
                                    <TableCell>{detalle.precio_unitario}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button
                    className="button"
                    type="submit"
                    style={{
                        padding: "5px",
                        color: "white",
                        backgroundColor: "#7e530f",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                    }}
                >
                    Enviar
                </button>
            </form> */}

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                >
                <h1 className="title">Nuevo ingreso</h1>
                <div>
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
                    helperText={errorProveedor && 'El proveedor es requerido'}
                    >
                    <MenuItem value="" disabled>
                        Selecciona un proveedor
                    </MenuItem>
                    {proveedores.map((proveedor) => (
                            <MenuItem key={proveedor.idproveedor} value={proveedor.nombre_proveedor}>
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
                    helperText={errorFecha ? 'La fecha es requerida' : ''}
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
                    helperText={errorInsumoId ? 'Tienes que seleccionar un insumo' : ''}
                    >
                    <MenuItem value="" disabled>
                        Selecciona un insumo
                    </MenuItem>
                    {seleccionarInsumo.map((insumo) => (
                                <MenuItem
                                    key={insumo.insumo_id}
                                    value={insumo.nombre_insumo}
                                >
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
                    helperText={errorCantidad ? 'La cantidad es requerida' : ''}
                    />
                    
                    <TextField
                    required
                    id="outlined-number"
                    label="Precio unitario"
                    type="number"
                    value={precio_unitario}
                    onChange={(e) => {
                        setPrecioUnitario(e.target.value);
                        setErrorPrecioUnitario(false);
                    }}
                    error={errorPrecioUnitario}
                    helperText={errorPrecioUnitario ? 'El precio unitario es requerido' : ''}
                    />

                    <TextField
                        id="outlined-read-only-input"
                        label="Monto Total"
                        value={monto_total}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    
                    <br />
                </div>
                <button className="button-guardar" type="submit" onClick={agregarDetalle}>
                    Agregar insumo
                </button>
                
                <h2 className="subtitulo-tablas">Lista de insumos</h2>
                <TableContainer class="table-container-format" component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Insumo</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Unitario</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaDetalle.map((detalle) => (
                                <TableRow key={detalle.identrada_id}>
                                    <TableCell>{detalle.insumo_id}</TableCell>
                                    <TableCell>{detalle.cantidad}</TableCell>
                                    <TableCell>{detalle.precio_unitario}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button-guardar" type="submit">
                    Guardar
                </button>
                </Box>

        </div>
    );
}
