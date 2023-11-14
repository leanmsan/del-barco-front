import { useEffect, useState } from "react";
import axios from 'axios';
import { format } from "date-fns";
import esLocale from 'date-fns/locale/es';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

export const TablaEntradas = () => {
    const [entradas, setEntradas] = useState([]);
    const [EntradasDetalle, setEntradasDetalle] = useState([]);
    const [selectedEntrada, setSelectedEntrada] = useState(null);
    const [showEntradaDetalle, setShowEntradaDetalle] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const responseEntrada = await axios.get('http://127.0.0.1:8000/api/entradas/');
            const responseEntradaDetalle = await axios.get('http://127.0.0.1:8000/api/entrada_detalles');
            setEntradas(responseEntrada.data.entradas);
            setEntradasDetalle(responseEntradaDetalle.data.entradas)
        } catch (error) {
            console.log('Error al obtener los datos', error);
        }
    };

    const renderEntradas = () => {
        const handleEntradaClick = (identrada) => {
            setSelectedEntrada(identrada);
            setShowEntradaDetalle(true);
        };

        return (
            <TableContainer component={Paper} class="table-container-format">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell class="cell-head-TableContainer">ID Entrada</TableCell>
                            <TableCell class="cell-head-TableContainer">Proveedor</TableCell>
                            <TableCell class="cell-head-TableContainer">Fecha</TableCell>
                            <TableCell class="cell-head-TableContainer">Monto Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entradas.map((entrada) => (
                            <TableRow key={entrada.identrada} onClick={() => handleEntradaClick(entrada.identrada)}>
                                <TableCell>{entrada.identrada}</TableCell>
                                <TableCell>{entrada.proveedor_id}</TableCell>
                                <TableCell>{format(new Date(entrada.fecha_entrada), 'EEEE dd MMMM yyyy', { locale: esLocale })}</TableCell>
                                <TableCell>{entrada.monto_total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderEntradasDetalle = () => {
        const filteredEntradasDetalle = EntradasDetalle.filter(
            (entradasDetalle) => entradasDetalle.identrada_id === selectedEntrada
        );

        const handleCloseEntradaDetalle = () => {
            setShowEntradaDetalle(false);
            setSelectedEntrada(null);
        }

        return (
            <>
                {showEntradaDetalle && (
                    <>
                        <h2 style={{
                            "margin-bottom": "0px", "padding": "5px",
                            "color": "#7e530f ", "border": "none", "font-size": "24px", "font-weight": "bold"
                        }}>Entradas Detalle
                        <button onClick={handleCloseEntradaDetalle}
                            style={{
                                "margin-left": "20px", "margin-top": "20px", "padding": "5px", "width": "fit-content",
                                "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                                "font-size": "16px", "font-weight": "bold"
                            }}>Cerrar Detalles
                        </button></h2>
                        <TableContainer component={Paper} class="table-container-format">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell class="cell-head-TableContainer">ID Entrada</TableCell>
                                        <TableCell class="cell-head-TableContainer">Insumo</TableCell>
                                        <TableCell class="cell-head-TableContainer">Cantidad</TableCell>
                                        <TableCell class="cell-head-TableContainer">Precio Unitario</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEntradasDetalle.map((entradasDetalle) => (
                                        <TableRow key={`${entradasDetalle.identrada}-${entradasDetalle.insumo_id}`}>
                                            <TableCell>{entradasDetalle.identrada_id}</TableCell>
                                            <TableCell>{entradasDetalle.insumo_id}</TableCell>
                                            <TableCell>{entradasDetalle.cantidad}</TableCell>
                                            <TableCell>{entradasDetalle.precio_unitario}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="section-content">
            <div>
            <h1 className="title">Entradas</h1>
                {renderEntradas()}
                {selectedEntrada && (
                    <>
                        
                        {renderEntradasDetalle()}
                    </>
                )}
            </div>
        </div>
    );
};