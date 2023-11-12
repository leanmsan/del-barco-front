import { useEffect, useRef, useState } from "react";
import "../../../css/form.css";
import RequiredFieldError from "../../../utils/errors";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

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
    const [lastInsertedId, setLastInsertedId] = useState(null);

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
                    setLastInsertedId(lastId);
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

    const agregarDetalle = () => {
        try {
            if (!insumo_id || !cantidad || !precio_unitario) {
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
                fecha_entrada,
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
                setLastInsertedId(data.id);
                setErrorProveedor(false);
                setErrorFecha(false);
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

            console.log("Entrada y detalles creados exitosamente");
        } catch (error) {
            if (error instanceof RequiredFieldError) {

                console.log('Error de validación', error.message);
            } else {
                console.log("Error de red", error);
            }
        }
    };

    return (
        <div className="section-content">
            <form
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
            </form>
        </div>
    );
}
