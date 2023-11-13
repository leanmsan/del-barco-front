import { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

export const TablaInsumos = () => {
  const [insumos, setData] = useState([]);
  const [tablaInsumos, setTablaInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const handleChange = (event) => {
    console.log(event.target.value);
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

  const handleModificar = (idInsumo) => {
    Swal.fire({
      title: 'Modificar insumo',
      html: `<form id="form-modificar">
              <label for="nombre">Nuevo nombre:</label>
              <input type="text" id="nombre" name="nombre" value="" required>
              <br>
              <label for="cantidad">Nueva cantidad:</label>
              <input type="text" id="cantidad" name="cantidad" value="" required>
              <br>
              <label for="medida">Nueva medida:</label>
              <input type="text" id="medida" name="medida" value="" required>
              <br>
              <label for="categoria">Nueva categoría:</label>
              <input type="text" id="categoria" name="categoria" value="" required>
              <br>
              <label for="precio">Nuevo precio:</label>
              <input type="text" id="precio" name="precio" value="" required>
            </form>`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const form = document.getElementById('form-modificar');
        const nuevoNombre = form.elements['nombre'].value;
        const nuevaCantidad = form.elements['cantidad'].value;
        const nuevaMedida = form.elements['medida'].value;
        const nuevaCategoria = form.elements['categoria'].value;
        const nuevoPrecio = form.elements['precio'].value;

        // Verificar que los campos no estén vacíos
        if (!nuevoNombre || !nuevaCantidad || !nuevaMedida || !nuevaCategoria || !nuevoPrecio) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
        } else {
          return {
            nuevoNombre,
            nuevaCantidad,
            nuevaMedida,
            nuevaCategoria,
            nuevoPrecio,
          };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nuevoNombre, nuevaCantidad, nuevaMedida, nuevaCategoria, nuevoPrecio } = result.value;
        // Actualizar la fila en la tabla con los nuevos valores
        const nuevaTablaInsumos = tablaInsumos.map((insumo) =>
          insumo.idinsumo === idInsumo
            ? {
                ...insumo,
                nombre_insumo: nuevoNombre,
                cantidad_disponible: nuevaCantidad,
                tipo_medida: nuevaMedida,
                categoria: nuevaCategoria,
                precio_unitario: nuevoPrecio,
              }
            : insumo
        );
        setTablaInsumos(nuevaTablaInsumos);
        setData(nuevaTablaInsumos);
        Swal.fire('Modificado', 'El insumo ha sido modificado correctamente', 'success');
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (searchTerm = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/insumos/?search=${searchTerm}`);

      setData(response.data.insumos);
      setTablaInsumos(response.data.insumos);
      console.log('response', response.data.insumos);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  return (
    <div className="section-content">
      <h1 className="title">Insumos</h1>
      <div className="search-box">
        <button className="btn-search">
          <i className="fas fa-search"></i>
        </button>
        <input className="input-search" type="text" placeholder="Buscar..." value={busqueda} onChange={handleChange} />
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
                  <Button variant="contained" size='small' class="button-on-table-modificar" onClick={() => handleModificar(row.idinsumo)}>Modificar</Button>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
