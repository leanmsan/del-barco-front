import { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom";
import RequiredFieldError from "../../utils/errors";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export function Signup() {
  const[email, setEmail] = useState("");
  const[emailError, setEmailError] = useState(false);

  

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {


      const response = await axios.post('http://127.0.0.1:8000/api/register/', formdata)
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
            onChange={handleOnchange}
          />
          <TextField
            required
            id="outlined-required-first-name"
            label="Nombre"
            value={first_name}
            name="first_name"
            onChange={handleOnchange}
          />
          <TextField
            required
            id="outlined-required-last-name"
            label="Apellido"
            value={last_name}
            name="last_name"
            onChange={handleOnchange}
          />
          <TextField
            required
            id="outlined-required-password"
            label="Contraseña"
            type="password"
            value={password}
            name="password"
            onChange={handleOnchange}
          />
          <TextField
            required
            id="outlined-required-password2"
            label="Confirmar contraseña"
            type="password"
            value={password2}
            name="password2"
            onChange={handleOnchange}
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