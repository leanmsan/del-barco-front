import { useEffect, useState } from "react";
import axios from 'axios';
import { format } from "date-fns";
import esLocale from 'date-fns/locale/es';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { Link } from 'react-router-dom'; 

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
                            <TableRow
                                key={entrada.identrada}
                                onClick={() => handleEntradaClick(entrada.identrada)}
                                className={selectedEntrada === entrada.identrada ? 'selected-row' : ''}
                            >
                                <TableCell style={{ fontWeight: selectedEntrada === entrada.identrada ? 'bold' : 'normal' }}>{entrada.identrada}</TableCell>
                                <TableCell style={{ fontWeight: selectedEntrada === entrada.identrada ? 'bold' : 'normal' }}>{entrada.proveedor_id}</TableCell>
                                <TableCell style={{ fontWeight: selectedEntrada === entrada.identrada ? 'bold' : 'normal' }}>{format(new Date(entrada.fecha_entrada), 'EEEE dd MMMM yyyy', { locale: esLocale })}</TableCell>
                                <TableCell style={{ fontWeight: selectedEntrada === entrada.identrada ? 'bold' : 'normal' }}>{entrada.monto_total}</TableCell>
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
                        <h2 className="subtitulo-tablas">Detalles de ingreso
                        
                        <button className="button-cerrar-detalles" onClick={handleCloseEntradaDetalle}>
                            Cerrar detalles
                        </button>
                        </h2>
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
            <h1 className="title">Ingresos</h1>
            <Link to='/registroentradas'>
          <button className='btn-create-sin-searchbox'>+ Nuevo ingreso</button>
        </Link>
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