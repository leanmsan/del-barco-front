import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import '../../css/form.css';

export function RecetasForm() {
  const [nombreReceta, setNombreReceta] = useState('');
  const [errorNombreReceta, setErrorNombreReceta] = useState(false);

  const [tipoReceta, setTipoReceta] = useState('');
  const [errorTipoReceta, setErrorTipoReceta] = useState(false);

  const [insumoId, setInsumoId] = useState('');
  const [errorInsumoId, setErrorInsumoId] = useState(false);

  const [cantidad, setCantidad] = useState('');
  const [errorCantidad, setErrorCantidad] = useState(false);

  const [tipoMedida, setTipoMedida] = useState('');
  const [errorTipoMedida, setErrorTipoMedida] = useState(false);

  const [listaDetalles, setListaDetalles] = useState([]);
  const [errorListaDetalles, setErrorListaDetalles] = useState(false);

  const [listaInsumos, setListaInsumos] = useState([]);
  const [errorListaInsumos, setErrorListaInsumos] = useState(false);
  
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/insumos/');
      const data = await response.json();
      setListaInsumos(data.insumos);
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    }
  };

  const validarFormulario = () => {
    var aux = true;
    if (nombreReceta.trim() === "") {
      setErrorNombreReceta(true);
    } else {
      setErrorNombreReceta(false);
      aux = false;
    }

    if (tipoReceta.trim() === "") {
      setErrorTipoReceta(true);
    } else {
      setErrorTipoReceta(false);
      aux = false;
    }
    
    if (aux || listaDetalles.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos del formulario antes de enviarlo.',
      });
      return false;
    } else {
      return true;
    }
    
  };

  const handleNombreRecetaChange = (e) => {
    setNombreReceta(e.target.value);
    setErrorNombreReceta(false);
  };
  

  const handleTipoRecetaChange = (e) => {
    setTipoReceta(e.target.value);
    setErrorTipoMedida(false);
  };

  const handleInsumoIdChange = (e) => {
    setInsumoId(e.target.value);
    setErrorInsumoId(false);

    const auxInsumo = e.target.value;
    
    const selectedInsumo = listaInsumos.find((insumo) => insumo.nombre_insumo === auxInsumo);

    setTipoMedida(selectedInsumo.tipo_medida);
    setErrorTipoMedida(false);
    
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
    setErrorCantidad(false);
  };

  const handleTipoMedidaChange = (e) => {
    setTipoMedida(e.target.value);
    setErrorTipoMedida(false);
  };

  const handleAgregarDetalle = () => {
    if (insumoId && cantidad && tipoMedida) {
      
      const nuevoDetalle = {
        insumoId: insumoId,
        cantidad: cantidad,
        tipoMedida: tipoMedida,
      };

      setListaDetalles([...listaDetalles, nuevoDetalle]);
      setInsumoId('');
      setCantidad('');
      setTipoMedida('');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Todos los campos de detalle son obligatorios',
      });
    }
  };

  const handleQuitarDetalle = (index) => {
    const nuevasDetalles = [...listaDetalles];
    nuevasDetalles.splice(index, 1);
    setListaDetalles(nuevasDetalles);
  };

  const handleButtonPress = () => {
    // Puedes agregar lógica adicional aquí antes de deshabilitar la edición
    setEditable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const recetasApiUrl = 'http://127.0.0.1:8000/api/recetas/';
    const recetasDetallesApiUrl = 'http://127.0.0.1:8000/api/receta_detalles/';

    const recetasData = {
      nombre_receta: nombreReceta,
      tipo: tipoReceta,
    };

    try {
      const recetasResponse = await fetch(recetasApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recetasData),
      });

      const recetasResult = await recetasResponse.json();

      if (recetasResponse.ok) {
        // Receta creada con éxito, ahora agregar detalles
        const recetaId = recetasResult.last_inserted_receta;

        const promises = listaDetalles.map(async (detalle, index) => {
          const recetasDetallesData = {
            receta_id: recetaId,
            insumo_id: detalle.insumoId,
            cantidad: detalle.cantidad,
            tipo_medida: detalle.tipoMedida,
          };

          const recetasDetallesResponse = await fetch(recetasDetallesApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recetasDetallesData),
          });

          return recetasDetallesResponse.json();
        });

        const detallesResults = await Promise.all(promises);

        Swal.fire({
          icon: 'success',
          title: 'Receta creada con éxito',
          showConfirmButton: false,
          timer: 1500,
        });

        // Limpiar formulario después del envío exitoso
        setNombreReceta('');
        setTipoReceta('');
        setInsumoId('');
        setCantidad('');
        setTipoMedida('');
        setListaDetalles([]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la receta',
          text: 'Ha ocurrido un error al crear la receta. Por favor, inténtalo de nuevo.',
        });
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  };

  return (
    <div className='section-content-form'>
      {/* <form className='form' onSubmit={handleSubmit}>
        <h1 className='title'>Nueva Receta</h1>
        <div className='input-control'>
          <label className='form-label'>Nombre de la Receta:
          <input type='text' value={nombreReceta} onChange={handleNombreRecetaChange} />
          {errorNombreReceta && (
              <div className="error-message">El nombre es requerido</div>
            )}
            </label>
          <label>Tipo de Receta: 
          
          <input type='text' className='form-input' value={tipoReceta} onChange={handleTipoRecetaChange} />
          {errorTipoReceta && (
              <div className="error-message">El tipo de receta es requerido</div>
            )}
          </label>
          <label className='form-label'>Insumo ID:
          <select className='form-input' value={insumoId} onChange={handleInsumoIdChange}>
            <option value=''>Seleccionar Insumo</option>
            {listaInsumos.map((insumo) => (
              <option key={insumo.insumo_id} value={insumo.insumo_id}>
                {insumo.nombre_insumo}
              </option>
            ))}
          </select>
            {errorInsumoId && (
              <div className="error-message">El insumo es requerido</div>
            )}
          </label>
          <label className='form-label'>Cantidad:
          <input type='number' className='form-input' value={cantidad} onChange={handleCantidadChange} />
          {errorCantidad && (
              <div className="error-message">La cantidad es requerida</div>
            )}
          </label>
          <label className='form-label'>Tipo de Medida:
          <input type='text' className='form-input' value={tipoMedida} onChange={handleTipoMedidaChange} />
          {errorTipoMedida && (
              <div className="error-message">El tipo de medida es requerido</div>
            )}
          </label>
          <button
            type='button'
            onClick={handleAgregarDetalle}
            className='form-button'
            style={{
              padding: '5px',
              color: 'white',
              backgroundColor: '#7e530f ',
              borderRadius: '4px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            Agregar Detalle
          </button>
          {listaDetalles.length > 0 && (
            <div>
              <h3>Detalles Agregados:</h3>
              <ul>
                {listaDetalles.map((detalle, index) => (
                  <li key={index}>
                    {detalle.insumoId} - {detalle.cantidad} - {detalle.tipoMedida}{' '}
                    <button type='button' onClick={() => handleQuitarDetalle(index)}>
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type='submit'
            className='form-button'
            style={{
              padding: '5px',
              color: 'white',
              backgroundColor: '#7e530f ',
              borderRadius: '4px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            Enviar
          </button>
        </div>
      </form> */}

      <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                >
                <h1 className="title">Nueva receta</h1>
                <div>
                <TextField
                  required
                  id="outlined-required"
                  label="Nombre de receta"
                  type="text"
                  value={nombreReceta}
                  onChange={handleNombreRecetaChange}
                  error={errorNombreReceta}
                  helperText={errorNombreReceta ? 'El nombre de receta es requerido' : ''}
                  InputProps={{
                    readOnly: !editable, // Establecer readOnly en función del estado editable
                  }}
                />

                <TextField
                  required
                  id="outlined-required"
                  label="Tipo de receta"
                  type="text"
                  value={tipoReceta}
                  onChange={handleTipoRecetaChange}
                  error={errorTipoReceta}
                  helperText={errorTipoReceta ? 'El tipo de receta es requerido' : ''}
                  InputProps={{
                    readOnly: !editable, // Establecer readOnly en función del estado editable
                  }}
                />


                    <TextField
                    required
                    id="outlined-select-currency"
                    select
                    label="Insumo"
                    type="text"
                    value={insumoId}
                    onChange={handleInsumoIdChange}
                    error={errorInsumoId}
                    helperText={errorInsumoId ? 'Tienes que seleccionar un insumo' : ''}
                    >
                    <MenuItem value="" disabled>
                        Selecciona un insumo
                    </MenuItem>
                    {listaInsumos.map((insumo) => (
                                <MenuItem
                                    key={insumo.insumo_id}
                                    value={insumo.nombre_insumo}

                                >
                                    {insumo.nombre_insumo}
                                </MenuItem>
                            ))}
                    </TextField>

                    
                <TextField
                        id="outlined-read-only-input"
                        label="Tipo de medida"
                        value={tipoMedida}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                  
                    <TextField
                    required
                    id="outlined-number"
                    label="Cantidad"
                    type="number"
                    value={cantidad}
                    onChange={(e) => {
                        setCantidad(e.target.value);
                        setErrorCantidad(false);
                    }}
                    error={errorCantidad}
                    helperText={errorCantidad ? 'La cantidad es requerida' : ''}
                    />
                    

                    
                    <br />
                </div>
                <br />
                <button className="button-guardar" type="submit" onClick={handleAgregarDetalle}>
                    Agregar insumo
                </button>
                <h2 className="subtitulo-tablas">Lista de insumos</h2>
                {listaDetalles.length >= 0 && (
                  <div>
                    
                    <TableContainer class="table-container-format" component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell class="cell-head-TableContainer">Insumo</TableCell>
                                <TableCell class="cell-head-TableContainer">Cantidad</TableCell>
                                <TableCell class="cell-head-TableContainer">Tipo Medida</TableCell>
                                <TableCell colSpan={2} style={{ textAlign: 'center' }} class="cell-head-TableContainer">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaDetalles.map((detalle, index) => (
                                <TableRow key={index}>
                                    <TableCell>{detalle.insumoId}</TableCell>
                                    <TableCell>{detalle.cantidad}</TableCell>
                                    <TableCell>{detalle.tipoMedida}</TableCell>
                                    <TableCell><button type='button' class="button-on-table-modificar" onClick={() => handleQuitarDetalle(index)}>
                            Modificar
                          </button>
                          </TableCell>
                          <TableCell>
                          <button type='button' class="button-on-table-baja" onClick={() => handleQuitarDetalle(index)}>
                            Quitar
                          </button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> 
                </div>
                )}
                <button className="button-guardar" type="submit">
                    Guardar
                </button>
                </Box>

    </div>
  );
}
