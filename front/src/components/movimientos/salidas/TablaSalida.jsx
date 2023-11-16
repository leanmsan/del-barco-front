import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import esLocale from 'date-fns/locale/es';

import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export const TablaSalidasMovimientos = () => {
  const [salidas, setSalidas] = useState([]);
  const [salidasDetalle, setSalidasDetalle] = useState([]);
  const [selectedSalidas, setSelectedSalidas] = useState(null);
  const [showSalidasDetalle, setShowSalidasDetalle] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseSalida = await axios.get('http://127.0.0.1:8000/api/salidas/');
      const responseSalidaDetalles = await axios.get('http://127.0.0.1:8000/api/salida_detalles/');
      setSalidas(responseSalida.data.salidas);
      setSalidasDetalle(responseSalidaDetalles.data.salidas);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const renderSalidas = () => {
    const handleSalidasClick = (idsalida) => {
      setSelectedSalidas(idsalida);
      setShowSalidasDetalle(true);
    };

    return (
      <TableContainer component={Paper} class="table-container-format">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell class="cell-head-TableContainer">Id Salida</TableCell>
              <TableCell class="cell-head-TableContainer">Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salidas.map((salida) => (
              <TableRow key={salida.idsalida} onClick={() => handleSalidasClick(salida.idsalida)}
                  className={selectedSalidas === salida.idsalida ? 'selected-row' : ''}
              >
                <TableCell>{salida.idsalida}</TableCell>
                <TableCell>{format(new Date(salida.fecha_salida), 'EEEE dd MMMM yyyy', { locale: esLocale })}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderSalidasDetalle = () => {
    const filteredSalidasDetalle = salidasDetalle.filter(
      (salidasDetalle) => salidasDetalle.idsalida_id === selectedSalidas
    );

    const handleCloseSalidasDetalle = () => {
      setShowSalidasDetalle(false);
      setSelectedSalidas(null);
    };

    return (
      <>
        {showSalidasDetalle && (
          <>
            <h2 className="subtitulo-tablas">Detalles de egresos
            <button className="button-cerrar-detalles" onClick={handleCloseSalidasDetalle}>
                            Cerrar detalles
                        </button></h2>
            <TableContainer component={Paper} class="table-container-format">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell class="cell-head-TableContainer">ID Salidas</TableCell>
                    <TableCell class="cell-head-TableContainer">Nombre insumo</TableCell>
                    <TableCell class="cell-head-TableContainer">Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSalidasDetalle.map((salidasDetalle) => (
                    <TableRow key={`${salidasDetalle.idsalida_id}-${salidasDetalle.insumo_id}`}>
                      <TableCell>{salidasDetalle.idsalida_id}</TableCell>
                      <TableCell>{salidasDetalle.insumo_id}</TableCell>
                      <TableCell>{salidasDetalle.cantidad}</TableCell>

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
    <div className='section-content'>

      <div>
      <h1 className="title">Egresos</h1>
      <Link to='/registrosalidas'>
          <button className='btn-create-sin-searchbox'>+ Nuevo egreso</button>
        </Link>
        {renderSalidas()}
        {selectedSalidas && (
          <>
            
            {renderSalidasDetalle()}
          </>
        )}
      </div>
    </div>
  );
};