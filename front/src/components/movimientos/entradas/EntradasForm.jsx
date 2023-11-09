import { useEffect, useState } from "react";
import "../../../css/form.css";

// imports para la tabla con los insumos que componen el detalle
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

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

    const [detalle, setDetalle] = useState("")
    const [listaDetalle, setListaDetalle] = useState([]);
    const [lastInsertedId, setLastInsertedId] = useState(null);

    // listado de proveedores 
    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/proveedores/');
                const data = await response.json();

                if (response.ok) {
                    setProveedores(data.proveedores);
                } else {
                    console.log('Error al obtener los proveedores', response)
                }
            } catch (error) {
                console.log('Error de red', error)
            }
        };
        fetchProveedores();
    }, []);

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
                const response = await fetch('http://127.0.0.1:8000/api/lastid/');
                const data = await response.json();
                //console.log('Esto es data', data);
                const lastId = data.lastid + 1;
                //console.log('Esto es ultimo id', lastId);

                if (response.ok) {
                    setLastInsertedId(lastId);
                    setIdEntradaId(lastId);
                } else {
                    console.log('Error al obtener el último id de entrada', response);
                }
            } catch (error) {
                console.log('Error de red', error);
            }
        };

        fetchLastInsertedId();
    }, []);

    const agregarDetalle = () => {
        if (insumo_id && cantidad && precio_unitario) {
            // Crea un nuevo detalle
            const nuevoDetalle = {
                identrada_id: identrada_id,
                insumo_id: insumo_id,
                cantidad: cantidad,
                precio_unitario: precio_unitario,
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
            setPrecioUnitario("");
            console.log('Esto es InsumoId despues de agregar detalle', insumo_id);
            console.log('Esto es Cantidad despues de agregar detalle', cantidad);
            console.log('Esto es Precio Unitario despues de agregar detalle', precio_unitario);

            document.getElementById("EntradaDetalle").reset();
        } else {
            // Manejo de la situación en la que falta información
            console.log('Falta información para agregar un detalle');
        }
    };
    

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!proveedor_id || !fecha_entrada) {
            setErrorProveedor(!proveedor_id);
            setErrorFecha(!fecha_entrada);
            return;
        }

        const entrada = {
            proveedor_id,
            fecha_entrada,
            monto_total,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/entradas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entrada),
            });

            if (response.ok) {
                const data = await response.json();
                setLastInsertedId(data.id); // Actualiza lastInsertedId con el ID de la entrada creada
            } else {
                console.log('Error al crear la entrada', response);
                return;
            }

            // Envía detalles de entrada
            const promises = listaDetalle.map((detalle) =>
                fetch('http://127.0.0.1:8000/api/entrada_detalles/', {
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
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="title">Nueva entrada</h1>
                <div className="input-control">
                    {/* entrada */}
                    <label>Proveedor
                        <select value={proveedor_id} onChange={(e) => {
                            setProveedorId(e.target.value);
                            setErrorProveedor(false)
                        }}>
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.idproveedor} value={proveedor.nombre_proveedor}>
                                    {proveedor.nombre_proveedor}
                                </option>
                            ))}
                        </select>
                        {errorProveedor && (
                            <div className="error-message">Selecciona un proveedor</div>
                        )}
                    </label>
                    <label>
                        <input type="date" name="fecha" onChange={(e) => {
                            setFechaEntrada(e.target.value);
                            setErrorFecha(false)
                        }} />
                        {errorFecha && (
                            <div className="error-message">Tienes que seleccionar una fecha</div>
                        )}
                    </label>
                    <label>Monto Total</label>
                    <p>{monto_total}</p>
                </div>

                {/* entrada detalle*/}
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
                    <label>Precio Unitario
                        <input type="number" name="precio_unitario" onChange={(e) => {
                            setPrecioUnitario(e.target.value);
                            setErrorPrecioUnitario(false);

                        }} />
                        {errorPrecioUnitario && (
                            <div className="error-message">Tienees que especificar el precio</div>
                        )}
                    </label>
                </div>
                <button className="button" type="button" onClick={agregarDetalle}>Agregar insumo</button>

                {/* Tabla con los insumos en el detalle */}
                <TableContainer>
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
                <button className="button" type="submit">Enviar</button>
            </form>
        </div>
    )
}