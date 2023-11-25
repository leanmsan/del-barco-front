import { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom";
//import RequiredFieldError from "../../utils/errors";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

export function Signup() {
  const[email, setEmail] = useState("");
  const[emailError, setEmailError] = useState(false);

  const[first_name, setFirstName] = useState("");
  const[errorFirstName, setFirstNameError] = useState(false);

  const[last_name, setLastName] = useState("");
  const[errorLastName, setLastNameError] = useState(false);

  const[password, setPassword] = useState("");
  const[errorPassword, setPasswordError] = useState(false);

  const[password2, setPassword2] = useState("");
  const[password2ErrorMessage, setPassword2ErrorMessage] = useState("");
  const[errorPassword2, setPassword2Error] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      email.trim() === "" ||
      first_name.trim() === "" ||
      last_name.trim() === "" ||
      password.trim() === "" ||
      password2.trim() === "" ||
      emailError ||
      errorFirstName ||
      errorLastName ||
      errorPassword ||
      errorPassword2
    ) {
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      // No enviar el formulario si hay errores
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/')
      //console.log(response.data)
      if (response.status === 201) {
        navigate("/otp/verify")
      }
    } catch (error) {
      console.log('Se produjo un error al registrar el usuario', error)
    }
  }

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
            helperText={emailError && 'El email es requerido'}
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