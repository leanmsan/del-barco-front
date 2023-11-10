import { useEffect, useRef, useState } from "react";
import "../../../css/form.css";

// imports para la tabla con los insumos que componen el detalle
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

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

    const [detalle, setDetalle] = useState("")
    const [listaDetalle, setListaDetalle] = useState([]);
    const [lastInsertedId, setLastInsertedId] = useState(null);

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
                    setLastInsertedId(lastId);
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
    const agregarDetalle = () => {
        if (insumo_id && cantidad) {
            // Crea un nuevo detalle
            const nuevoDetalle = {
                idsalida_id: idsalida_id,
                insumo_id: insumo_id,
                cantidad: cantidad,
            };
    
            // Calcula el subtotal del nuevo detalle
            const subtotal = nuevoDetalle.cantidad * nuevoDetalle.precio_unitario;
    
            // Inicializa nuevoTotal con el valor actual de monto_total o 0 si no tiene valor
            var nuevoTotal = monto_total || 0;
    
            // Calcula el nuevo total sumando el subtotal al total anterior
            nuevoTotal = nuevoTotal + subtotal;
    
            // Actualiza la lista de detalles y el total
            setListaDetalle([...listaDetalle, nuevoDetalle]);
            setMontoTotal(nuevoTotal);
    
            // Reinicia los estados a vacío
            setInsumoId("");
            setCantidad("");
            console.log('Esto es InsumoId despues de agregar detalle', insumo_id);
            console.log('Esto es Cantidad despues de agregar detalle', cantidad);

            if (salidaDetalleFormRef.current) {
                salidaDetalleFormRef.current.reset()
            }
        } else {
            // Manejo de la situación en la que falta información
            console.log('Falta información para agregar un detalle');
        }
    };
    
    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fecha_salida) {
            setErrorFecha(!fecha_salida);
            return;
        }

        const salida = {
            fecha_salida,
            monto_total,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/salidas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salida),
            });

            if (response.ok) {
                const data = await response.json();
                setLastInsertedId(data.id); // Actualiza lastInsertedId con el ID de la entrada creada
                setFechaSalida('')
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

            console.log('Entrada y detalles creados exitosamente');
        } catch (error) {
            console.log('Error de red', error);
        }
    };

    return (
        <div className="section-content">
            <form  ref={salidaDetalleFormRef} id="SalidaDetalle" className="form" onSubmit={handleSubmit}>
                <h1 className="title">Nueva salida</h1>
                <div className="input-control">
                    {/* salida */}
                    <label>Fecha
                        <input type="date" name="fecha" onChange={(e) => {
                            setFechaSalida(e.target.value);
                            setErrorFecha(false)
                        }} />
                        {errorFecha && (
                            <div className="error-message">Tienes que seleccionar una fecha</div>
                        )}
                    </label>
                </div>

                {/* salida detalle*/}
                <div className="input-control">
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
                            }}>Agregar insumo</button>

                {/* Tabla con los insumos en el detalle */}
                <TableContainer>
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
            </form>
        </div>
    )
}