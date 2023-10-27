import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

export function SalidasForm() {
    const navigate = useNavigate();
    const [salidaData, setSalidaData] = useState({
        fecha: "",
        salidaDetalle: {
            idinsumo_id: "",
            cantidad: "",
        }
    });

    const [errorIdinsumo_idr, setErrorIdinsumo_id] = useState(false);
    const [errorFecha, setErrorFecha] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extraer los datos de salida y detalle
        const { fecha, salidaDetalle } = salidaData;

        const salida = {
            fecha,
        };

        try {
            // Realizar la solicitud para crear la salida principal
            const response = await fetch('http://127.0.0.1:8000/api/salidas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salida)
            });

            if (fecha.trim() === '') {
                setErrorFecha(true);
            } else {
                setErrorFecha(false);
            }

            // Verificar la respuesta y manejar errores como lo haces actualmente

            if (response.ok) {
                console.log('Salida principal creada exitosamente');
                createSalidaDetalle(salidaDetalle);
            } else {
                console.log('Error al crear la salida principal');
            }
        } catch (error) {
            console.log('Error de red', error);
        }
    };

    const createSalidaDetalle = async (salidaDetalle) => {
        try {
            // Realizar la solicitud para crear el detalle de la salida
            const response = await fetch('http://127.0.0.1:8000/api/salida_detalles/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salidaDetalle),
            });

            // Verificar la respuesta y manejar errores como lo haces actualmente

            if (response.ok) {
                console.log('Detalle de salida creado exitosamente');
                navigate('/salidas');
            } else {
                console.log('Error al crear el detalle de salida');
            }
        } catch (error) {
            console.log('Error de red', error);
        }
    };

    return (
        <div className='container'>
            <form className='form' onSubmit={handleSubmit}>
                <h1 className='title'>Registro de Salida</h1>
                <div className='input-control'>
                    <label>Fecha</label>
                    <input
                        type='date'
                        name='fecha'
                        onChange={(e) => {
                            setSalidaData({
                                ...salidaData,
                                fecha: e.target.value
                            });
                            setErrorFecha(false);
                        }}
                    />
                    {errorFecha && <div className="error-message">Es requerido que ingrese una fecha</div>}
                    <br />
                </div>
                <button className='button' type="submit">Enviar</button>
            </form>
        </div>
    )
}
