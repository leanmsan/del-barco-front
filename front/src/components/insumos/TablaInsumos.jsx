import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

export const TablaInsumos = () => {
  const [insumos, setData] = useState([]);
  const [tablaInsumos, setTablaInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [proveedores, setProveedores] = useState([]);

  const handleChange = (event) => {
    setBusqueda(event.target.value);
    filtrar(event.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    let resultadosBusqueda = tablaInsumos.filter((elemento) => {
      if (elemento.nombre_insumo.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())) {
        return elemento;
      }
    });
    setData(resultadosBusqueda);
  };

  useEffect(() => {
    const fetchData = async (searchTerm = '') => {
      try {
        const insumosResponse = await axios.get(`http://127.0.0.1:8000/api/insumos/?search=${searchTerm}`);
        const proveedoresResponse = await axios.get('http://127.0.0.1:8000/api/proveedores/');
        setData(insumosResponse.data.insumos);
        setTablaInsumos(insumosResponse.data.insumos);
        setProveedores(proveedoresResponse.data.proveedores);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  const handleModificarInsumo = (index) => {
    const insumoActual = tablaInsumos.find((e) => e.idinsumo === index);
    Swal.fire({
      title: 'Modificar insumo',
      html: `<form id="form-modificar">
              <label htmlFor="nombre_insumo">Nuevo nombre: </label>
              <input type="text" id="nombre_insumo" name="nombre_insumo" value="${insumoActual.nombre_insumo}" required>
              <br/>
              <label htmlFor="cantidad_disponible">Nueva cantidad :</label>
              <input type="text" id="cantidad_disponible" name="cantidad_disponible" value="${insumoActual.cantidad_disponible}" required>
              <br/>
              <label htmlFor="tipo_medida">Nueva Medida:</label>
              <input type="text" id="tipo_medida" name="tipo_medida" value="${insumoActual.tipo_medida}" required>
              <br/>
              <label htmlFor="categoria">Nueva Categoria:</label>
              <input type="text" id="categoria" name="categoria" value="${insumoActual.categoria}" required>
              <br/>
              <label htmlFor="precio_unitario">Nuevo precio:</label>
              <input type="number" id="precio_unitario" name="precio_unitario" value="${insumoActual.precio_unitario}" required>
              <br/>
              <label htmlFor="proveedor_id">Nuevo proveedor:</label>
              <select id="proveedor_id" name="proveedor_id" value="${insumoActual.proveedor_id}" required>
                ${proveedores.map((proveedor) => `
                  <option key="${proveedor.nombre_proveedor}" value="${proveedor.nombre_proveedor}">
                    ${proveedor.nombre_proveedor}
                  </option>
                `).join('')}
              </select>
            </form>`,
      showCancelButton: true,
      confirmButtonColor: '#1450C9',
      cancelButtonColor: '#FF3434',
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const form = document.getElementById('form-modificar');
        const idinsumo = index;
        const nuevoNombre = form.elements['nombre_insumo'].value;
        const nuevaCantidad = form.elements['cantidad_disponible'].value;
        const nuevaMedidas = form.elements['tipo_medida'].value;
        const nuevaCategoria = form.elements['categoria'].value;
        const nuevoPrecio = form.elements['precio_unitario'].value;
        const nuevoProveedor = form.elements['proveedor_id'].value;

        // Verificar que los campos no estén vacíos
        if (!nuevoNombre || !nuevaCantidad || !nuevaMedidas || !nuevaCategoria || !nuevoPrecio || !nuevoProveedor) {
          Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
          return;
        }

        try {
          await axios.patch(`http://127.0.0.1:8000/api/insumos/${idinsumo}/`, {
            nombre_insumo: nuevoNombre,
            cantidad_disponible: nuevaCantidad,
            tipo_medida: nuevaMedidas,
            categoria: nuevaCategoria,
            precio_unitario: nuevoPrecio,
            proveedor_id: nuevoProveedor,
          });

          const nuevaTablaInsumo = tablaInsumos.map((insumo) =>
            insumo.idinsumo === index
              ? {
                ...insumo,
                nombre_insumo: nuevoNombre,
                cantidad_disponible: nuevaCantidad,
                tipo_medida: nuevaMedidas,
                categoria: nuevaCategoria,
                precio_unitario: nuevoPrecio,
                proveedor_id: nuevoProveedor,
              }
              : insumo
          );
          console.log('esto es nueva tabla insumo', nuevaTablaInsumo)
          setTablaInsumos(nuevaTablaInsumo);
          setData(nuevaTablaInsumo);
          Swal.fire('Modificado', 'El insumo ha sido modificado correctamente', 'success');
        } catch (error) {
          
          console.log('Error al realizar la solicitud PATCH:', error);
          Swal.fire('Error', 'Error al actualizar el insumo', 'error');
        }
      }
    });
  };

  return (
    <div className="section-content">
      <h1 className="title">Insumos</h1>
      <div className="search-box">
        <button className="btn-search">
          <i className="fas fa-search"></i>
        </button>
        <input className="input-search" type="text" placeholder="Buscar..." value={busqueda} onChange={handleChange} />
      
        <Link to='/altainsumos'>
          <button className='btn-create'>+ Nuevo insumo</button>
        </Link>
      </div>
      <TableContainer class="table-container-format" component={Paper}>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell class="cell-head-TableContainer">Nombre insumo</TableCell>
            <TableCell class="cell-head-TableContainer">Cantidad disponible</TableCell>
            <TableCell class="cell-head-TableContainer">Tipo de medida</TableCell>
            <TableCell class="cell-head-TableContainer">Categoria</TableCell>
            <TableCell class="cell-head-TableContainer">Precio unitario</TableCell>
            <TableCell class="cell-head-TableContainer">Proveedor</TableCell>
            <TableCell class="cell-head-TableContainer">Acciones</TableCell>
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
              <TableCell>
                  <button type='button' class="button-on-table-modificar" onClick={() => handleModificarInsumo(row.idinsumo)}>Modificar</button>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
