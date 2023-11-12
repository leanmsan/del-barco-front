import { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import axios from 'axios';


export const TablaInsumos = () => {
  const [insumos, setData] = useState([]);
  const [tablaInsumos, setTablaInsumos] = useState([]);
  const [busqueda, setBusqueda]= useState("");

  const handleChange = (event) => {
    console.log(event.target.value);
    setBusqueda(event.target.value);
    filtrar(event.target.value);
  }

const filtrar = (terminoBusqueda) => {
let resultadosBusqueda = tablaInsumos.filter((elemento) => {
    if(elemento.nombre_insumo.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())){
        return elemento;
    }
})
setData(resultadosBusqueda);
}
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (searchTerm = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/insumos/?search=${searchTerm}`);
     
      setData(response.data.insumos);
      setTablaInsumos(response.data.insumos)
      console.log("response",response.data.insumos);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  

  return (
    <div className="section-content">
      <h1 className="title">Insumos</h1>
      <div className='search-box'>
      <button className="btn-search"><i className="fas fa-search"></i></button>
        <input 
          className='input-search' type="text" placeholder="Buscar..." 
          value={busqueda} onChange={handleChange}
        />
      </div>
      <TableContainer style={{"margin": "10px 20px 10px 0", "padding": "5px 5px 5px 5px", "max-width": "800px", "width": "95%"}} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre insumo</TableCell>
            <TableCell>Cantidad disponible</TableCell>
            <TableCell>Tipo de medida</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Precio unitario</TableCell>
            <TableCell>Proveedor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {insumos.map((row) => (
            <TableRow key={row.idinsumo}>
              <TableCell>{row.nombre_insumo}</TableCell>
              <TableCell style={{ textTransform: 'capitalize'}}>{row.cantidad_disponible}</TableCell>
              <TableCell>{row.tipo_medida}</TableCell>
              <TableCell>{row.categoria}</TableCell>
              <TableCell>{row.precio_unitario}</TableCell>
              <TableCell>{row.proveedor_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    
  );
};
