import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export function AltaInsumos() {
  const [nombre_insumo, setNombre_insumo] = useState("");
  const [errorNombre_insumo, setErrorNombre_insumo] = useState(false);

  const [cantidad_disponible, setCantidad_disponible] = useState();
  const [errorCantidad_disponible, setErrorCantidad_disponible] = useState(false);
  const [errorCantidadNegativa, setErrorCantidadNegativa] = useState(false);

  const [tipo_medida, setTipo_medida] = useState("");
  const [errorTipo_medida, setErrorTipo_medida] = useState(false);

  const [categoria, setCategoria] = useState("");
  const [errorCategoria, setErrorCategoria] = useState(false);

  const [precio_unitario, setPrecio_unitario] = useState();
  const [errorPrecio_unitario, setErrorPrecio_unitario] = useState(false);
  const [errorPrecioNegativo, setErrorPrecioNegativo] = useState(false);

  const [proveedor_id, setProveedor_id] = useState("");
  const [errorProveedor_id, setErrorProveedor_id] = useState(false);

  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  const navegate = useNavigate();

  const unidadesDeMedida = ["Kg", "g", "Mg", "L", "Ml", "Cc"];

  useEffect(() => {
    async function fetchProveedores() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/proveedores/");
        if (response.ok) {
          const data = await response.json();
          setProveedores(data.proveedores);
        } else {
          console.error(
            "Error al obtener la lista de proveedores desde la API"
          );
        }
      } catch (error) {
        console.error("Error en la solicitud GET", error);
      }
    }
    fetchProveedores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación para valores negativos
    if (cantidad_disponible < 0) {
      setErrorCantidadNegativa(true);
    } else {
      setErrorCantidadNegativa(false);
    }

    if (precio_unitario < 0) {
      setErrorPrecioNegativo(true);
    } else {
      setErrorPrecioNegativo(false);
    }

    if (
      nombre_insumo.trim() === "" ||
      cantidad_disponible.trim() === "" ||
      tipo_medida.trim() === "" ||
      categoria.trim() === "" ||
      precio_unitario.trim() === "" ||
      proveedor_id.trim() === "" ||
      errorNombre_insumo ||
      errorCantidad_disponible ||
      errorTipo_medida ||
      errorCategoria ||
      errorPrecio_unitario ||
      errorProveedor_id ||
      errorCantidadNegativa ||
      errorPrecioNegativo
    ) {
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos y asegúrese de que la cantidad y el precio no sean negativos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      // No enviar el formulario si hay errores
      return;
    }

    const insumo = {
      nombre_insumo,
      cantidad_disponible,
      tipo_medida,
      categoria,
      precio_unitario,
      proveedor_id,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/insumos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(insumo),
      });

      if (response.ok) {
        console.log("El formulario se envió correctamente");

        Swal.fire({
          title: 'Éxito',
          text: 'El insumo se registró correctamente!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          console.log('Antes de redireccionar a tabla insumos');
          navegate('/tablainsumos')
          console.log('Después de redireccionar a tabla insumos');
        }).catch(error => {
          console.error('Error al redireccionar:', error);
        });

      } else {
        console.log("Error al enviar el formulario.");
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar el formulario.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      console.log("esto es insumos", insumo)
    } catch (error) {
      console.log("Error en la solicitud POST", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar el formulario.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      showProgress: true,
      steps: [
        { element: '.section-content-form', popover: { title: 'Nuevo insumo', description: 'Aquí podrás cargar los datos del insumo a registrar', side: "left", align: 'start' }},
        { element: '.button-guardar', popover: { title: 'Guardar', description: 'Una vez cargados los datos, presiona Guardar para registrarlo', side: "right", align: 'start' }},
        { popover: { title: 'Eso es todo!', description: 'Ya puedes realizar la carga.' } }
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive()
  };

  return (
    <div className="section-content-form">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="title">Nuevo insumo</h1>
        <div>
          <TextField
            required
            id="outlined-required"
            label="Nombre de insumo"
            type="text"
            value={nombre_insumo}
            onChange={(e) => {
              setNombre_insumo(e.target.value);
              setErrorNombre_insumo(false);
            }}
            error={errorNombre_insumo}
            helperText={errorNombre_insumo ? 'El nombre de insumo es requerido' : ''}
          />
          <TextField
            required
            id="outlined-number"
            label="Cantidad disponible"
            type="number"
            value={cantidad_disponible}
            onChange={(e) => {
              const value = e.target.value;
              setCantidad_disponible(value);
              setErrorCantidad_disponible(false);
              setErrorCantidadNegativa(value < 0);
            }}
            error={errorCantidad_disponible || errorCantidadNegativa}
            helperText={errorCantidad_disponible ? 'La cantidad disponible es requerida' : (errorCantidadNegativa ? 'La cantidad no puede ser negativa' : '')}
          />
          <TextField
            required
            id="outlined-select-currency"
            select
            label="Tipo de medida"
            value={tipo_medida}
            onChange={(e) => {
              setTipo_medida(e.target.value);
              setErrorTipo_medida(false);
            }}
            error={errorTipo_medida}
            helperText={errorTipo_medida && 'La unidad de medida es requerida'}
          >
            <MenuItem value="" disabled>
              Selecciona la unidad de medida
            </MenuItem>
            {unidadesDeMedida.map((unidad, index) => (
              <MenuItem key={index} value={unidad}>
                {unidad}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            id="outlined-disabled"
            label="Categoria"
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setErrorCategoria(false);
            }}
            error={errorCategoria}
            helperText={errorCategoria ? 'La categoría es requerida' : ''}
          />
          <TextField
            required
            id="outlined-number"
            label="Precio unitario"
            type="number"
            value={precio_unitario}
            onChange={(e) => {
              const value = e.target.value;
              setPrecio_unitario(value);
              setErrorPrecio_unitario(false);
              setErrorPrecioNegativo(value < 0);
            }}
            error={errorPrecio_unitario || errorPrecioNegativo}
            helperText={errorPrecio_unitario ? 'El precio unitario es requerido' : (errorPrecioNegativo ? 'El precio no puede ser negativo' : '')}
          />

          <TextField
            required
            id="outlined-select-currency"
            select
            label="Proveedor"
            value={proveedor_id}
            onChange={(e) => {
              setProveedor_id(e.target.value);
              setErrorProveedor_id(false);
            }}
            error={errorProveedor_id}
            helperText={errorProveedor_id && 'El proveedor es requerido'}
          >
            <MenuItem value="" disabled>
              Selecciona un proveedor
            </MenuItem>
            {proveedores.map((proveedor) => (
              <MenuItem key={proveedor.idproveedor} value={proveedor.nombre_proveedor}>
                {proveedor.nombre_proveedor}
              </MenuItem>
            ))}
          </TextField>
          <br />
        </div>
        <br />
        <button className="button-guardar" type="submit">
          Guardar
        </button>
      </Box>
      <div className='btn-ayuda'>
        <button onClick={driverAction} className='button-ayuda'><FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff", }} /></button>
      </div>
    </div>
  );
}
