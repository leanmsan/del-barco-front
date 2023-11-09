import { useEffect, useState } from "react";
import "../../../css/form.css";

// imports para la tabla con los insumos que componen el detalle
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export function SalidasForm() {

    //salida
    const [fecha_salida, setFechaSalida] = useState("");
    const [errorFecha, setErrorFecha] = useState(false);

    const [descripcion, setDescripcion] = useState("");

    // Salida detalle
    const [idsalida_id, setIdsalidaId] = useState("");
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
                const response = await fetch('http://127.0.0.1:8000/api/lastid/');
                const data = await response.json();
                console.log('Esto es data', data);
                const lastId = data.lastid + 1;
                console.log('Esto es ultimo id', lastId);

                if (response.ok) {
                    setLastInsertedId(lastId);
                    setIdsalidaId(lastId);
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
        if (insumo_id && cantidad ) {
            const idSalidaId = idsalida_id ? parseInt(idsalida_id) : null
            setListaDetalle([
                ...listaDetalle,
                {
                    idsalida_id: idsalida_id,
                    insumo_id,
                    cantidad,
                },
            ]);
            setInsumoId("");
            setCantidad("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fecha_salida) {
            setErrorFecha(!fecha_salida);
            return;
        }

        const entrada = {
            fecha_salida,
            descripcion,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/salidas/', {
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
                fetch('http://127.0.0.1:8000/api/salida_detalles/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(detalle),
                })
            );

            // Espera a que se completen todas las solicitudes
            await Promise.all(promises);
            console.log('esto es promise',promises);

            console.log('Entrada y detalles creados exitosamente');
        } catch (error) {
            console.log('Error de red', error);
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="title">Nueva salida</h1>
                <div className="input-control">
                    {/* salda */}
                    <label>
                        <input type="date" name="fecha" onChange={(e) => {
                            setFechaSalida(e.target.value);
                            setErrorFecha(false)
                        }} />
                        {errorFecha && (
                            <div className="error-message">Tienes que seleccionar una fecha</div>
                        )}
                    </label>
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
                </div>
                <button className="button" type="button" onClick={agregarDetalle}>Agregar insumo</button>

                {/* Tabla con los insumos en el detalle */}



                <button className="button" type="submit">Enviar</button>
            </form>
        </div>
    )
}