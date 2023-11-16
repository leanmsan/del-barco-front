import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import esLocale from 'date-fns/locale/es';

import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

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
      <TableContainer component={Paper} class="table-container-format tabla-egresos">
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
                <TableCell style={{ fontWeight: selectedSalidas === salida.idsalida ? 'bold' : 'normal' }}>{salida.idsalida}</TableCell>
                <TableCell style={{ fontWeight: selectedSalidas === salida.idsalida ? 'bold' : 'normal' }}>{format(new Date(salida.fecha_salida), 'EEEE dd MMMM yyyy', { locale: esLocale })}</TableCell>
                
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

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      showProgress: true,
      steps: [
        { element: '.section-content', popover: { title: 'Egresos', description: 'Aquí podrás ver los datos de los insumos que salieron', side: "left", align: 'start' }},
        { element: '.tabla-egresos', popover: { title: 'Lista de egresos', description: 'Aquí podrás ver el listado de todos los egresos', side: "right", align: 'start' }},
        { element: '.tabla-egresos', popover: { title: 'Seleccionar', description: 'Cuando hagas click sobre algún egreso, podrás ver los detalles más abajo', side: "left", align: 'start' }},
        { element: '.btn-create-sin-searchbox', popover: { title: 'Nuevo egreso', description: 'También puedes ir a registrar un nuevo egreso directamente!', side: "right", align: 'start' }},
        { popover: { title: 'Eso es todo!', description: 'Ya puedes continuar' } }
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive()
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
      <div  style={{ position: 'absolute', top: 0, right: 0, margin: '1.5rem' }}>
                <button onClick={driverAction}><FontAwesomeIcon icon={faQuestion} style={{color: "#ffffff",}} /></button>
            </div>
    </div>
  );
};