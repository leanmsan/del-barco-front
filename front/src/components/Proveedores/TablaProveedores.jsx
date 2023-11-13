import { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

export const TablaProveedores = () => {
  const [proveedores, setData] = useState([]);
  const [tablaProveedores, setTablaProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const handleChange = (event) => {
    console.log(event.target.value);
    setBusqueda(event.target.value);
    filtrar(event.target.value);
  }

  const filtrar = (terminoBusqueda) => {
    let resultadosBusqueda = tablaProveedores.filter((elemento) => {
      if (elemento.nombre_proveedor.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())) {
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

  const handleModificarProveedor = (index) => {
    // Obtener los valores actuales de la fila en la tabla de proveedores
    const proveedorActual = tablaProveedores.find((proveedor) => proveedor.idproveedor === index);

    Swal.fire({
      title: 'Modificar proveedor',
      html: `<form id="form-modificar">
              <label for="nombre">Nuevo nombre:</label>
              <input type="text" id="nombre" name="nombre" value="${proveedorActual.nombre_proveedor}" required>
              <br/>
              <label for="mail">Nuevo Mail:</label>
              <input type="text" id="mail" name="mail" value="${proveedorActual.mail}" required>
              <br/>
              <label for="contacto">Nuevo Contacto:</label>
              <input type="text" id="contacto" name="contacto" value="${proveedorActual.telefono}" required>
            </form>`,
      showCancelButton: true,
      confirmButtonColor: '#51FF48',
      cancelButtonColor: '#FF3434',
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const form = document.getElementById('form-modificar');
        const idproveedor = index;
        const nuevoNombre = form.elements['nombre'].value;
        const nuevoMail = form.elements['mail'].value;
        const nuevoContacto = form.elements['contacto'].value;

        // Verificar que los campos no estén vacíos
        if (!nuevoNombre || !nuevoMail || !nuevoContacto) {
          Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
          return;
        }

        try {
          // Realizar la solicitud PATCH a la API con los nuevos datos
          await axios.patch(`http://127.0.0.1:8000/api/proveedores/${idproveedor}/`, {
            nombre_proveedor: nuevoNombre,
            mail: nuevoMail,
            telefono: nuevoContacto,
          });

          // Actualizar la fila en la tabla con los nuevos valores
          const nuevaTablaProveedores = tablaProveedores.map((proveedor) =>
            proveedor.idproveedor === index
              ? {
                ...proveedor,
                nombre_proveedor: nuevoNombre,
                mail: nuevoMail,
                telefono: nuevoContacto, // Ajusta este campo según la estructura real de tus datos
              }
              : proveedor
          );
          setTablaProveedores(nuevaTablaProveedores);
          setData(nuevaTablaProveedores);
          Swal.fire('Modificado', 'El proveedor ha sido modificado correctamente', 'success');
        } catch (error) {
          console.error('Error al realizar la solicitud PATCH:', error);
          Swal.fire('Error', 'Error al actualizar el proveedor', 'error');
        }
      }
    });
  };

  const handleEliminarProveedor = async (idproveedor, proveedor) => {
    try {
      const result = await Swal.fire({
        title: `¿Estás seguro que quieres dar de baja a ${proveedor}?`,
        text: "Esta acción no se puede revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar',
      });
  
      if (result.isConfirmed) {
        const response = await axios.patch(`http://127.0.0.1:8000/api/proveedores/${idproveedor}/`, {
          estado: 'I',
        });
  
        fetchData();
  
        Swal.fire({
          title: 'Dado de baja exitosamente!',
          text: 'El proveedor ha sido eliminado.',
          icon: 'success',
        });
  
        console.log('Solicitud PATCH exitosa', response.data);
      } else if (result.isDenied) {
        Swal.fire('Cancelado!', '', 'info');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud PATCH:', error.message);
      Swal.fire('Error al dar de baja', '', 'error');
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
      <TableContainer class="table-container-format" component={Paper}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell class="cell-head-TableContainer">Nombre</TableCell>
              <TableCell class="cell-head-TableContainer">Mail</TableCell>
              <TableCell class="cell-head-TableContainer">Contacto</TableCell>
              <TableCell class="cell-head-TableContainer">Estado</TableCell>
              <TableCell colSpan={2} style={{ textAlign: 'center' }} class="cell-head-TableContainer">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((row) => (
              <TableRow key={row.idproveedor}>
                <TableCell>{row.nombre_proveedor}</TableCell>
                <TableCell>{row.mail}</TableCell>
                <TableCell>{row.telefono}</TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell>
                  <button type='button' class="button-on-table-modificar" onClick={() => handleModificarProveedor(row.idproveedor)}>
                    Modificar
                  </button>
                </TableCell>
                <TableCell>
                  <button type='button' class="button-on-table-baja" onClick={() => handleEliminarProveedor(row.idproveedor, row.nombre_proveedor)}>Dar de Baja</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
