import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from "sweetalert2";
import RequiredFieldError from "../../utils/errors";
import { useNavigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import InputMask from "react-input-mask";


export function AltaProveedores() {
  const [nombre_proveedor, setNombre] = useState("");
  const [errorNombre, setErrorNombre] = useState(false);

  const [mail, setMail] = useState("");
  const [errorMail, setErrorMail] = useState(false);

  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navegate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validarCampo(nombre_proveedor, setNombre, setErrorNombre, 'nombre_proveedor');
      validarCampo(mail, setMail, setErrorMail, 'mail', emailRegex);
      validarCampo(telefono, setTelefono, setErrorTelefono, 'telefono');

      if (errorNombre || errorMail || errorTelefono) {
        throw new RequiredFieldError('Por favor, complete todos los campos correctamente.');
      }

      const proveedor = {
        nombre_proveedor,
        mail,
        telefono,
      };

      if (nombre_proveedor.trim() === '' || mail.trim() === '' || telefono.trim() === '') {
        throw new RequiredFieldError('Por favor, complete todos los campos.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/proveedores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Éxito',
          text: 'El proveedor se registró correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navegate('/proveedores');
        }).catch(error => {
          console.error('Error al redireccionar:', error);
        });
      } else {
        throw new Error('Error al crear el proveedor');
      }
    } catch (error) {
      if (error instanceof RequiredFieldError) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar el formulario, por favor verifique los campos',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const validarCampo = (valor, setValor, setError, nombreCampo, regex = null) => {
    if (valor.trim() === '') {
      setError(true);
      setValor("");
    } else if (regex && !regex.test(valor.trim())) {
      setError(true);
      setValor("");
      throw new RequiredFieldError(`El campo ${nombreCampo} no es válido`);
    } else {
      setError(false);
    }
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      showProgress: true,
      steps: [
        { element: '.section-content-form', popover: { title: 'Nuevo proveedor', description: 'Aquí podrás cargar los datos del proveedor a registrar', side: "left", align: 'start' }},
        { element: '.button-guardar', popover: { title: 'Guardar', description: 'Una vez cargados los datos, presiona Guardar para registrarlo', side: "right", align: 'start' }},
        { popover: { title: 'Eso es todo!', description: 'Ya puedes continuar' } }
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive()
  };

  return (
    <div className='section-content-form'>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="title">Nuevo proveedor</h1>
        <div>
          <TextField
            required
            id="outlined-required"
            label="Nombre de proveedor"
            type="text"
            value={nombre_proveedor}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrorNombre(false);
            }}
            error={errorNombre}
            helperText={errorNombre ? 'El nombre de proveedor es requerido' : ''}
          />

          <TextField
            required
            id="outlined-disabled"
            label="Email"
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
              setErrorMail(false);
            }}
            error={errorMail}
            helperText={errorMail ? 'El email es requerido' : ''}
          />

<InputMask
            mask="+549 9999999999"
            maskChar=""
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              setErrorTelefono(false);
            }}
          >
            {() => (
              <TextField
                required
                id="outlined-number"
                label="Número de contacto"
                type="tel"
                error={errorTelefono}
                helperText={errorTelefono ? "El contacto es requerido" : ""}
              />
            )}
          </InputMask>

          <br />
        </div>
        <br />
        <button className="button-guardar" type="submit">
          Guardar
        </button>
      </Box>
      <div className='btn-ayuda'>
        <button onClick={driverAction} className='button-ayuda'><FontAwesomeIcon icon={faQuestion} style={{ color: "#ffffff" }} /></button>
      </div>
    </div>
  );
}
