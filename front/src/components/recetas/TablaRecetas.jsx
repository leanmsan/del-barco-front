import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

export const TablaRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [recetasDetalle, setRecetaDetalle] = useState([]);
  const [selectedRecetas, setSelectedRecetas] = useState(null);
  const [showRecetasDetalle, setShowRecetasDetalle] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseRecetas = await axios.get('http://127.0.0.1:8000/api/recetas/');
      const responseRecetasDetalles = await axios.get('http://127.0.0.1:8000/api/receta_detalles/');
      console.log("esto es rd",responseRecetasDetalles.data.recetas)
      setRecetas(responseRecetas.data.recetas);
      setRecetaDetalle(responseRecetasDetalles.data.recetas);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const renderRecetas = () => {
    const handleRecetasClick = (nombre_receta) => {
      setSelectedRecetas(nombre_receta);
      setShowRecetasDetalle(true);
    };

    return (
      <TableContainer component={Paper} style={{ "margin-top": "10px", "padding": "5px" }}>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recetas.map((receta) => (
              <TableRow key={receta.nombre_receta} onClick={() => handleRecetasClick(receta.nombre_receta)}>
                
                <TableCell>{receta.nombre_receta}</TableCell>
                <TableCell>{receta.tipo}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderRecetasDetalle = () => {
    const filteredRecetasDetalle = recetasDetalle.filter(
      (recetasDetalle) => recetasDetalle.receta_id === selectedRecetas
    );

    const handleCloseRecetasDetalle = () => {
      setShowRecetasDetalle(false);
      setSelectedRecetas(null);
    };

    return (
      <>
        {showRecetasDetalle && (
          <>
            <button onClick={handleCloseRecetasDetalle}
              style={{
                "margin-top": "20px", "padding": "5px", "width": "fit-content",
                "color": "white", "background-color": "#7e530f", "border-radius": "4px", "border": "none",
                "font-size": "16px", "font-weight": "bold"
              }}>Cerrar Detalles
            </button>
            <TableContainer component={Paper} style={{ "margin-top": "20px", "padding": "5px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    
                    <TableCell>Insumo</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Tipo Medida</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecetasDetalle.map((e) => (
                    <TableRow key={`${e.receta_id}-${e.insumo_id}`}>
                      
                      <TableCell>{e.insumo_id}</TableCell>
                      <TableCell>{e.cantidad}</TableCell>
                      <TableCell>{e.tipo_medida}</TableCell>

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
        <h2 style={{
          "margin-top": "2rem", "margin-bottom": "0px", "padding": "5px",
          "color": "#7e530f", "border": "none", "font-size": "24px", "font-weight": "bold"
        }}>Recetas
        </h2>
        {renderRecetas()}
        {selectedRecetas && (
          <>
            <h2 style={{
              "margin-top": "50px", "margin-bottom": "0px", "padding": "5px",
              "color": "#7e530f", "border": "none", "font-size": "24px", "font-weight": "bold"
            }}>Recetas Detalle</h2>
            {renderRecetasDetalle()}
          </>
        )}
      </div>
    </div>
  );
};