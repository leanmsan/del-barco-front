import { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import axios from 'axios';

export const TablaProveedores = () => {
  const [proveedores, setData] = useState([]);
  const [tablaProveedores, setTablaProveedores] = useState([]);
  const [busqueda, setBusqueda]= useState("");

  const handleChange = (event) => {
    console.log(event.target.value);
    setBusqueda(event.target.value);
    filtrar(event.target.value);
  }

  const filtrar = (terminoBusqueda) => {
    let resultadosBusqueda = tablaProveedores.filter((elemento) => {
      if(elemento.nombre_proveedor.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())){
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
      const response = await axios.get(`http://127.0.0.1:8000/api/proveedores/?search=${searchTerm}`);
      setData(response.data.proveedores);
      setTablaProveedores(response.data.proveedores)
      console.log(response.data.proveedores);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  return (
    <div className='section-content'>
      <h1 className="title">Proveedores</h1>
      <div className='search-box'>
      <button className="btn-search"><i className="fas fa-search"></i></button>
        <input 
          className='input-search' type="text" placeholder="Buscar..." 
          value={busqueda} onChange={handleChange}
        />
      </div>
      <TableContainer style={{"margin-top": "10px", "padding": "5px"}} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((row) => (
            <TableRow key={row.idproveedor}>
              <TableCell>{row.nombre_proveedor}</TableCell>
              <TableCell>{row.mail}</TableCell>
              <TableCell>{row.telefono}</TableCell>              
              <TableCell>{row.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};
