import { useEffect, useRef, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import "../../../css/form.css";
import Swal from "sweetalert2";
import RequiredFieldError from "../../../utils/errors";
import { useNavigate } from "react-router-dom";

// imports para la tabla con los insumos que componen el detalle
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

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

    
    const navegate = useNavigate()
    // listado de insumos
    useEffect(() => {
        const fetchInsumos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/insumos/');
                const data = await response.json();

                if (response.ok) {
                    setSeleccionarInsumo(data.insumos);
                } else {
                    console.log('Error al obtener los insumos', response);
                }
            } catch (error) {
                console.log('Error de red', error)
            }
        }

        fetchInsumos();
    }, []);

    // obtenemos el ultimo id insertado en la tabla entrada
    useEffect(() => {
        const fetchLastInsertedId = async () => {
            try {
                // Realiza una solicitud a la API de entradas para obtener todas las entradas
                const response = await fetch('http://127.0.0.1:8000/api/lastidsalida/');
                const data = await response.json();
                //console.log('Esto es data', data);
                const lastId = data.lastid + 1;
                //console.log('Esto es ultimo id', lastId);

                if (response.ok) {
                    setIdSalidaId(lastId);
                } else {
                    console.log('Error al obtener el último id de entrada', response);
                }
            } catch (error) {
                console.log('Error de red', error);
            }
        };

        fetchLastInsertedId();
    }, []);


    const salidaDetalleFormRef = useRef(null)

    const isPositiveNumber = (value) => {
        return !isNaN(value) && value > 0;
    };

    const agregarDetalle = () => {
        try {
            if (!insumo_id || !cantidad) {
                if (!insumo_id) {
                    setErrorInsumoId(true);
                }
                if (!cantidad) {
                    setErrorCantidad(true);
                }

                const cantidadNumero = parseFloat(cantidad);

                if (!isPositiveNumber(cantidadNumero)) {
                    setErrorCantidad(true);
                    throw new RequiredFieldError('Cantidad debe ser un número positivo');
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
                    idsalida_id: idsalida_id,
                    insumo_id: insumo_id,
                    cantidad: cantidad,
                };

                const subtotal = nuevoDetalle.cantidad * nuevoDetalle.precio_unitario;
                var nuevoTotal = monto_total || 0;
                nuevoTotal = nuevoTotal + subtotal;

                setListaDetalle([...listaDetalle, nuevoDetalle]);
                setMontoTotal(nuevoTotal);

                setInsumoId("");
                setCantidad("");

                if (salidaDetalleFormRef.current) {
                    salidaDetalleFormRef.current.reset();
                    setErrorInsumoId(false);
                    setErrorCantidad(false);
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

            const response = await fetch('http://127.0.0.1:8000/api/salidas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salida),
            });

            if (response.ok) {
                const data = await response.json();
                setIdSalidaId(data.id)
                setErrorFecha(false)
                setMontoTotal(0)
                setListaDetalle([])
            } else {
                console.log('Error al crear la entrada', response);
                return;
            }

            // Envía detalles de entrada
            const promises = listaDetalle.map((detalle) =>
                fetch('http://127.0.0.1:8000/api/salida_detalles/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(detalle),
                })
            );

            // Espera a que se completen todas las solicitudes
            console.log(promises);
            await Promise.all(promises);
            
            Swal.fire({
                title: 'Éxito',
                text: 'La salida se registró correctamente!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navegate('/salidas')
            })

            console.log('Entrada y detalles creados exitosamente');
        } catch (error) {
            console.log('Error de red', error);
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
            {/* <form  ref={salidaDetalleFormRef} id="SalidaDetalle" className="form" onSubmit={handleSubmit}>
                <h1 className="title">Nueva salida</h1>
                <div className="input-control">
                    */} {/* salida */}
                    {/* <label>Fecha
                        <input type="date" name="fecha" onChange={(e) => {
                            setFechaSalida(e.target.value);
                            setErrorFecha(false)
                        }} />
                        {errorFecha && (
                            <div className="error-message">Tienes que seleccionar una fecha</div>
                        )}
                    </label>
                </div> */}

                {/* salida detalle*/}
               {/*  <div className="input-control">
                    <label name="insumo_id">Insumo
                        <select value={insumo_id} onChange={(e) => {
                            setInsumoId(e.target.value);
                            setErrorInsumoId(false);
                        }}>
                            <option value="">Seleccione un insumo</option>
                            {seleccionarInsumo.map((insumo) => (
                                <option key={insumo.insumo_id} value={insumo.nombre_insumo}>
                                    {insumo.nombre_insumo}
                                </option>
                            ))}
                        </select>
                        {errorInsumoId && (
                            <div className="error-message">Tienes que seleccionar un insumo</div>
                        )}
                    </label>
                    <label>Cantidad
                        <input type="number" name="cantidad" onChange={(e) => {
                            setCantidad(e.target.value);
                            setErrorCantidad(false);

                        }} />
                        {errorCantidad && (
                            <div className="error-message">Tienes que especificar la cantidad</div>
                        )}
                    </label>
                </div>
                <button className="button" type="button" onClick={agregarDetalle}  style={{
                                "padding": "5px",
                                "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                                "font-size": "16px", "font-weight": "bold", "width": "100%"
                            }}>Agregar insumo</button> */}

                {/* Tabla con los insumos en el detalle */}
               {/*  <TableContainer style={{"margin": "10px 20px 0 0", "padding": "5px 5px 5px 5px"}} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Insumo</TableCell>
                                <TableCell>Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaDetalle.map((detalle) => (
                                <TableRow key={detalle.identrada_id}>
                                    <TableCell>{detalle.insumo_id}</TableCell>
                                    <TableCell>{detalle.cantidad}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" type="submit"  style={{
                                "padding": "5px",
                                "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                                "font-size": "16px", "font-weight": "bold", "width": "100%"
                            }}>Enviar</button>
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
                <h1 className="title">Nuevo egreso</h1>
                <div>
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
                    
                    
                    <br />
                </div>
                <button className="button" type="button" onClick={agregarDetalle}  style={{
                        "padding": "5px", 
                        "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                        "font-size": "16px", "font-weight": "bold", "width": "150px"
                    }}>Agregar insumo</button>

                {/* Tabla con los insumos en el detalle */}
                <TableContainer class="table-container-format" component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Insumo</TableCell>
                                <TableCell>Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaDetalle.map((detalle) => (
                                <TableRow key={detalle.identrada_id}>
                                    <TableCell>{detalle.insumo_id}</TableCell>
                                    <TableCell>{detalle.cantidad}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" type="submit"  style={{
                        "padding": "5px", 
                        "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                        "font-size": "16px", "font-weight": "bold", "width": "150px"
                    }}>Enviar</button>

                </Box>

        </div>
    )
}