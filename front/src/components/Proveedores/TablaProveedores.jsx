import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export const TablaProveedores = () => {
  const [proveedores, setData] = useState([]);
  const [tablaProveedores, setTablaProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const handleChange = (event) => {
    setBusqueda(event.target.value);
    filtrar(event.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    let resultadosBusqueda = tablaProveedores.filter((elemento) => {
      if (elemento.nombre_proveedor.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())) {
        return elemento;
      }
    });
    setData(resultadosBusqueda);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (searchTerm = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/proveedores/?search=${searchTerm}`);

      const sortedProveedores = response.data.proveedores.sort((a, b) => {
        if (a.estado === 'A' && b.estado === 'I') return -1;
        if (a.estado === 'I' && b.estado === 'A') return 1;
        return 0;
      });

      setData(sortedProveedores);
      setTablaProveedores(sortedProveedores);
      console.log(sortedProveedores);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleModificarProveedor = (index) => {
    const proveedorActual = tablaProveedores.find((proveedor) => proveedor.idproveedor === index);

    Swal.fire({
      title: 'Modificar proveedor',
      html: `<form id="form-modificar">
              <label htmlFor="nombre" style="display: block;">Nombre: </label>
              <input type="text" id="nombre" name="nombre" value="${proveedorActual.nombre_proveedor}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="mail" style="display: block;">Email: </label>
              <input type="text" id="mail" name="mail" value="${proveedorActual.mail}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
              <br/>
              <label htmlFor="contacto" style="display: block;">Contacto: </label>
              <input type="text" id="contacto" name="contacto" value="${proveedorActual.telefono}" required style="width: 100%; margin-bottom: 10px; height: 2.2rem; padding-left: 10px; background-color: white; color: black; border: 2px solid #444; border-radius: 10px;">
            
            </form>`,
      showCancelButton: true,
      confirmButtonColor: '#1450C9',
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoRegex = /^\+54 9 [0-9]{4} [0-9]{2}-[0-9]{4}$/;

        
        if (!emailRegex.test(nuevoMail)) {
          Swal.fire('Error', 'Por favor, introduce un correo electronico valido', 'error');
          return;
        }


        if (!telefonoRegex.test(nuevoContacto)) {
          Swal.fire('Error', 'Por favor, introduce un número de teléfono válido de Argentina', 'error');
          return;
        }


        if (!nuevoNombre || !nuevoMail || !nuevoContacto) {
          Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
          return;
        }

        try {
          await axios.patch(`http://127.0.0.1:8000/api/proveedores/${idproveedor}/`, {
            nombre_proveedor: nuevoNombre,
            mail: nuevoMail,
            telefono: nuevoContacto,
          });

          const nuevaTablaProveedores = tablaProveedores.map((proveedor) =>
            proveedor.idproveedor === index
              ? {
                  ...proveedor,
                  nombre_proveedor: nuevoNombre,
                  mail: nuevoMail,
                  telefono: nuevoContacto,
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
        text: 'Esta acción no se puede revertir.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
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

  const handleEnviarWhatsapp = (telefono) => {
    const numeroTelefono = telefono.replace(/[^\d]/g, ''); // Elimina todo excepto los dígitos
    const urlWhatsapp = `https://wa.me/${numeroTelefono}`;
    window.open(urlWhatsapp, '_blank');
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      showProgress: true,
      steps: [
        { element: '.section-content', popover: { title: 'Proveedores', description: 'Aquí podrás ver todos los proveedores cargados', side: 'left', align: 'start' } },
        { element: '.button-on-table-modificar', popover: { title: 'Modificar', description: 'Puedes cambiar algún dato del proveedor si crees necesario', side: 'left', align: 'start' } },
        { element: '.button-on-table-baja', popover: { title: 'Dar de baja', description: 'También puedes darlo de baja', side: 'left', align: 'start' } },
        { element: '.search-box', popover: { title: 'Buscar', description: 'Si no encuentras lo que buscas, puedes ingresar el nombre del proveedor para encontrarlo', side: 'right', align: 'start' } },
        { element: '.btn-create', popover: { title: 'Nuevo proveedor', description: 'También puedes ir a cargar un nuevo proveedor directamente!', side: 'right', align: 'start' } },
        { popover: { title: 'Eso es todo!', description: 'Ya puedes continuar' } },
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive();
  };

  return (
    <div className='section-content'>
      <h1 className="title">Proveedores</h1>
      <div className='search-box'>
        <button className="btn-search">
          <FontAwesomeIcon icon={faSearch} style={{ color: '#ffffff' }} />
        </button>
        <input
          className='input-search'
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={handleChange}
        />
        <Link to='/altaproveedores'>
          <button className='btn-create'>+ Nuevo proveedor</button>
        </Link>
      </div>
      <TableContainer class="table-container-format" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell class="cell-head-TableContainer">Nombre</TableCell>
              <TableCell class="cell-head-TableContainer">Mail</TableCell>
              <TableCell class="cell-head-TableContainer">Contacto</TableCell>
              <TableCell class="cell-head-TableContainer">Estado</TableCell>
              <TableCell colSpan={2} style={{ textAlign: 'center' }} class="cell-head-TableContainer">
                Acciones
              </TableCell>
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
                  <button
                    type='button'
                    className="button-on-table-modificar"
                    onClick={() => handleModificarProveedor(row.idproveedor)}
                  >
                    Modificar
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    type='button'
                    className="button-on-table-baja"
                    onClick={() => handleEliminarProveedor(row.idproveedor, row.nombre_proveedor)}
                  >
                    Dar de Baja
                  </button>
                </TableCell>
                <TableCell>
            <button
              type='button'
              className="button-on-table-whatsapp"
              onClick={() => handleEnviarWhatsapp(row.telefono)}
            >
              Enviar WhatsApp
            </button>
          </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ position: 'absolute', top: 0, right: 0, margin: '1.5rem' }}>
        <button onClick={driverAction}>
          <FontAwesomeIcon icon={faQuestion} style={{ color: '#ffffff' }} />
        </button>
      </div>
    </div>
  );
};
