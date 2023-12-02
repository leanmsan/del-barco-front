import { useState } from 'react'
import { useNavigate } from "react-router-dom";
//import RequiredFieldError from "../../utils/errors";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

export function Signup() {
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [first_name, setFirstName] = useState("");
  const [errorFirstName, setFirstNameError] = useState(false);

  const [last_name, setLastName] = useState("");
  const [errorLastName, setLastNameError] = useState(false);

  const [password, setPassword] = useState("");
  const [errorPassword, setPasswordError] = useState(false);

  const [password2, setPassword2] = useState("");
  const [password2ErrorMessage, setPassword2ErrorMessage] = useState("");
  const [errorPassword2, setPassword2Error] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const registro = {
      email,
      first_name,
      last_name,
      password,
      password2,
    };
  
    try {
      // Validar campos requeridos del lado del cliente
      if (!email || !first_name || !last_name || !password || !password2) {
        // Manejar errores de campo requerido de manera más específica
        if (email.trim() === "") {
          setEmailError(true);
          setEmailErrorMessage('El email es requerido');
          setEmail("");
        }
  
        if (first_name.trim() === "") {
          setFirstNameError(true);
          setFirstName("");
        }
  
        if (last_name.trim() === "") {
          setLastNameError(true);
          setLastName("");
        }
  
        if (password.trim() === "") {
          setPasswordError(true);
          setPassword("");
        }
  
        if (password2.trim() === "") {
          setPassword2Error(true);
          setPassword2ErrorMessage('La confirmación de la contraseña es requerida');
          setPassword2("");
        }
  
        throw new Error('Todos los campos son obligatorios');
      }
  
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registro),
      });
  
      if (response.status === 201) {
        // Manejar éxito
        //const responseData = await response.json();
        Swal.fire({
          title: "Correo Enviado",
          text: "Se ha enviado un correo electrónico con el enlace de recuperación",
          icon: "success",
          confirmButtonText: 'OK',
          didClose: () => {
            navigate("/otp/verify");
          }
        });
        //console.log(responseData);
      } else {
        // Manejar errores de respuesta del servidor
        const errorData = await response.json();
        //console.log('Error Data:', errorData);
  
        if (errorData.email && errorData.email[0] === "user with this Email Address already exists.") {
          setEmailError(true);
          setEmailErrorMessage('Esta dirección de correo ya está en uso.');
        } else if (errorData.non_field_errors) {
          // Modificar la condición para verificar si hay algún mensaje de error
          setPassword2Error(true);
          setPassword2ErrorMessage(errorData.non_field_errors[0]);
          //console.log('Error de contraseñas no coincidentes:', errorData.non_field_errors);
        } else {
          // Manejar otros errores de respuesta del servidor
          Swal.fire({
            title: 'Error',
            text: 'Se produjo un error. Por favor, vuelva a intentar.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    } catch (error) {
      // Manejar errores de red y otros errores inesperados
      Swal.fire({
        title: 'Error',
        text: 'Se produjo un error. Por favor, vuelva a intentar.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      //console.log('Se produjo un error al registrar el usuario', error);
    }
  };   
  

  return (
    <div className='section-content-form'>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="title">Registrar usuario</h1>
        <div className="campos">
          <TextField
            required
            id="outlined-required-email"
            label="Correo"
            type="email"
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            error={emailError}
            helperText={emailError && emailErrorMessage}
          />
          <TextField
            required
            id="outlined-required-first-name"
            label="Nombre"
            value={first_name}
            name="first_name"
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError(false);
            }}
            error={errorFirstName}
            helperText={errorFirstName && 'El nombre es requerido'}
          />
          <TextField
            required
            id="outlined-required-last-name"
            label="Apellido"
            value={last_name}
            name="last_name"
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError(false);
            }}
            error={errorLastName}
            helperText={errorLastName && 'El apellido es requerido'}
          />
          <TextField
            required
            id="outlined-required-password"
            label="Contraseña"
            type="password"
            value={password}
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            error={errorPassword}
            helperText={errorPassword && 'La contraseña es requerida'}
          />
          <TextField
            required
            id="outlined-required-password2"
            label="Confirmar contraseña"
            type="password"
            value={password2}
            name="password2"
            onChange={(e) => {
              setPassword2(e.target.value);
              setPassword2Error(false);
            }}
            error={errorPassword2}
            helperText={errorPassword2 && password2ErrorMessage}
          />
        </div>
        <br />
        <button className="button-guardar btn-guardar" type="submit">
          Registrar
        </button>
      </Box>
    </div>
  )
}