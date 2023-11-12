import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../css/form.css';

export function RecetasForm() {

  const [nombreReceta, setNombreReceta] = useState('');
  const [tipoReceta, setTipoReceta] = useState('');
  const [insumoId, setInsumoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [tipoMedida, setTipoMedida] = useState('');
  const [listaDetalles, setListaDetalles] = useState([]);
  const [lastInsertedId, setLastInsertedId] = useState(null);
  const [idRecetasId, setIdRecetasId] = useState(null);

  useEffect(() => {
    const fetchLastInsertedId = async () => {
      try {
        // Realiza una solicitud a la API de entradas para obtener todas las entradas
        const response = await fetch('http://127.0.0.1:8000/api/lastidreceta/');
        const data = await response.json();
        //console.log('Esto es data', data);
        const lastId = data.lastid + 1;
        //console.log('Esto es ultimo id', lastId);

        if (response.ok) {
          setLastInsertedId(lastId);
          setIdRecetasId(lastId);
        } else {
          console.log('Error al obtener el último id de entrada', response);
        }
      } catch (error) {
        console.log('Error de red', error);
      }
    };

    fetchLastInsertedId();
  }, []);


  const handleNombreRecetaChange = (e) => {
    setNombreReceta(e.target.value);
  };

  const handleTipoRecetaChange = (e) => {
    setTipoReceta(e.target.value);
  };

  const handleInsumoIdChange = (e) => {
    setInsumoId(e.target.value);
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
  };

  const handleTipoMedidaChange = (e) => {
    setTipoMedida(e.target.value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log('esto es recetas result',recetasResult)

      if (recetasResponse.ok) {
        // Receta creada con éxito, ahora agregar detalles
        const recetaId = recetasResult.last_inserted_receta;
        console.log('recetasId', recetaId)

        const promises = listaDetalles.map(async (detalle) => {
          const recetasDetallesData = {
            idrecetadetalle: listaDetalles.idrecetadetalle +  1,
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
        console.log('Detalles creados:', detallesResults);

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
    <div className='section-content'>
      <form className='form' onSubmit={handleSubmit}>
        <h1 className='title'>Nueva Receta</h1>
        <div className='input-control'>
          <label className='form-label'>Nombre de la Receta:</label>
          <br />
          <input type='text' value={nombreReceta} onChange={handleNombreRecetaChange} />
          <label>Tipo de Receta: </label>
          <br />
          <input type='text' className='form-input' value={tipoReceta} onChange={handleTipoRecetaChange} />
          <br />
          <label className='form-label'>Insumo ID:</label>
          <input type='text' className='form-input' value={insumoId} onChange={handleInsumoIdChange} />
          <label className='form-label'>Cantidad:</label>
          <input type='number' className='form-input' value={cantidad} onChange={handleCantidadChange} />
          <br />
          <label className='form-label'>Tipo de Medida:</label>
          <input type='text' className='form-input' value={tipoMedida} onChange={handleTipoMedidaChange} />
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
      </form>
    </div>
  );
}
