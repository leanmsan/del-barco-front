import { useState } from "react";
import navegate from 'react';
import "../../../css";

export function EntradaForm () {

    //entrada
    const [proveedor_id, setProveedorId] = useState("");
    const [errorProveedor, setErrorProveedor] = useState(false);

    const [fecha_entrada, setFechaEntrada] = useState("");
    const [errorFecha, setErrorFecha] = useState(false);

    const [monto_total, setMontoTotal] = useState("");

    // entrada detalle
    const [identrada_id, setIdEntradaId] = useState("");
    const [errorIdEntradaId, setErrorIdEntradaId] = useState(false);

    const [insumo_id, setIdInsumo] = useState("");
    const [errorInsumoId, setErrorInsumoId] = useState(false)

    const [cantidad, setcantidad] = useState("");
    const [errorCantidad, setErrorCantidad] = useState(false);

    const [precio_unitario, setPrecioUnitario] = useState("");
    const [errorPrecioUnitario, setErrorPrecioUnitario] = useState(false);

    // handlesubmit
    const handleSubmit = async (e) => {
        e.preventDefault()

        // handlesubmit entrada
        const entrada = {
            proveedor_id,
            fecha_entrada,
            monto_total,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/entradas', {
                method : 'POST',
                headers : {
                    'Content-Type': 'aplication/json',
                },
                body : JSON.stringify(entrada)
            })

            //validaciones
            if (proveedor_id.trim() === '') {
                setErrorProveedor(true);
            } else {
                setErrorProveedor(false)
            }

            if (fecha_entrada.trim() === '') {
                setErrorFecha(true);
            } else {
                setErrorFecha(false)
            }
        } catch (error) {
            console.log('error de red', error)
        }

        // handlesubmit entrada detalla
        const entradaDetalle = {
            identrada_id,
            insumo_id,
            cantidad,
            precio_unitario,
        };

        
    }

    return (
        <div>

        </div>
    )
}