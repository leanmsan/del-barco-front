import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import esLocale from 'date-fns/locale/es';

import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

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
              <TableRow key={salida.idsalida} onClick={() => handleSalidasClick(salida.idsalida)}>
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
            <h2 style={{
              "margin-bottom": "0px", "padding": "5px",
              "color": "#7e530f", "border": "none", "font-size": "24px", "font-weight": "bold"
            }}>Salidas Detalle
            <button onClick={handleCloseSalidasDetalle}
              style={{
                "margin-left": "20px", "width": "fit-content", "margin-top": "20px", "padding": "5px",
                "color": "white", "background-color": "#7e530f", "border-radius": "4px", "border": "none",
                "font-size": "16px", "font-weight": "bold"
              }}>Cerrar Detalles
            </button></h2>
            <TableContainer component={Paper} class="table-container-format">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell class="cell-head-TableContainer">ID Salidas</TableCell>
                    <TableCell class="cell-head-TableContainer">ID Insumo</TableCell>
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
      <h1 className="title">Salidas</h1>
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