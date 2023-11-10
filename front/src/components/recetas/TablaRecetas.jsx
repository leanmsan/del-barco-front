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
    const handleRecetasClick = (idreceta) => {
      setSelectedRecetas(idreceta);
      setShowRecetasDetalle(true);
    };

    return (
      <TableContainer component={Paper} style={{ "margin-top": "10px", "margin-left": "260px", "padding": "5px" }}>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recetas.map((receta) => (
              <TableRow key={receta.idreceta} onClick={() => handleRecetasClick(receta.idreceta)}>
                
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
      (recetasDetalle) => recetasDetalle.idrecetadetalle === selectedRecetas
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
                "margin-top": "20px", "margin-left": "260px", "padding": "5px", "width": "15%",
                "color": "white", "background-color": "#003084", "border-radius": "4px", "border": "none",
                "font-size": "16px", "font-weight": "bold"
              }}>Cerrar Detalles
            </button>
            <TableContainer component={Paper} style={{ "margin-top": "20px", "margin-left": "260px", "padding": "5px" }}>
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
                    <TableRow key={`${e.idsalida_id}-${e.idinsumo_id}`}>
                      
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
    <div>

      <div>
        <h2 style={{
          "margin-top": "100px", "margin-left": "260px", "margin-bottom": "0px", "padding": "5px",
          "color": "#003084", "border": "none", "font-size": "24px", "font-weight": "bold"
        }}>Recetas
        </h2>
        {renderRecetas()}
        {selectedRecetas && (
          <>
            <h2 style={{
              "margin-top": "50px", "margin-left": "260px", "margin-bottom": "0px", "padding": "5px",
              "color": "#003084", "border": "none", "font-size": "24px", "font-weight": "bold"
            }}>Recetas Detalle</h2>
            {renderRecetasDetalle()}
          </>
        )}
      </div>
    </div>
  );
};