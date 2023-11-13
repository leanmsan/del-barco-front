import { useEffect, useState } from "react";
import navegate from "react";
import "../../css/form.css"
import RequiredFieldError from "../../utils/errors";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from "sweetalert2";

export function AltaProveedores() {

  const [nombre_proveedor, setNombre] = useState("");
  const [errorNombre, setErrorNombre] = useState(false);

  const [mail, setMail] = useState("email@gmail.com");
  const [errorMail, setErrorMail] = useState(false);

  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault()

    const proveedor = {
      nombre_proveedor,
      mail,
      telefono,
    };

    try {

      if (nombre_proveedor.trim() === '') {
        setErrorNombre(true);
        setNombre("")
        throw new RequiredFieldError('Este campo es obligatorio');
      } else {
        setErrorNombre(false)
      }

      if (mail.trim() === '') {
        setErrorMail(true);
        setMail("")
        throw new RequiredFieldError('Este campo es obligatorio');
      } else {
        setErrorMail(false)
      }

      if (setErrorMail(!emailRegex.test(mail.trim()))) {
        setErrorMail(true);
        setMail("");
        throw new RequiredFieldError('Este campo es obligatorio');
      } else {
        setErrorMail(false);
      }

      if (telefono.trim() === '') {
        setErrorTelefono(true);
        setTelefono("");
        throw new RequiredFieldError('Este campo es obligatorio');
      } else {
        setErrorTelefono(false);
      }

      

      const response = await fetch('http://127.0.0.1:8000/api/proveedores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor)
      })

      if (response.ok) {
        Swal.fire({
          title: 'Éxito',
          text: 'La cocción se registró correctamente!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        //console.log(response, "esto es response")
        //console.log('proveedor creado exitosamente')
        navegate('/proveedores')
      } else {
        console.log('error al crear el proveedor')
      }
    } catch (error) {
      if (error instanceof RequiredFieldError) {
        console.log('Faltan completar datos requeridos', error.message)
      } else {
        console.log('error de red', error)
      }
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar el formulario',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }
  return (
    <div className='section-content' style={{"width": "50%", "max-width": "1000px", "min-width": "250px"}}>
      {/* <form className='form' onSubmit={handleSubmit}>
        <h1 className='title' >Nuevo proveedor</h1>
        <div className='input-control'>

          <label>Nombre</label>
          <input
            type='text'
            name='nombre'
            onChange={(e) => {
              setNombre(e.target.value)
              setErrorNombre(false)
            }}
          />
          {errorNombre && <div className='error-message'>El nombre es requerido</div>}
          <br />

          <label>Mail</label>
          <input
            type='email'
            name='mail'
            onChange={(e) => {
              setMail(e.target.value)
              setErrorMail(false)
            }}
          />
          {errorMail && <div className='error-message'>El mail es requerido</div>}
          <br />

          <label>Contacto</label>
          <input
            type='text'
            name='telefono'
            onChange={(e) => {
              setTelefono(e.target.value)
              setErrorTelefono(false)
            }}
          />
          {errorTelefono && <div className='error-message'>El contacto es requerido</div>}
          <br />
        </div>
        <button className='button' type="submit" style={{
          "padding": "5px",
          "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
          "font-size": "16px", "font-weight": "bold", "width": "100%"
        }}>Enviar</button>
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

          <TextField
          required
          id="outlined-number"
          label="Número de contacto"
          type="number"
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value);
            setErrorTelefono(false);
          }}
          error={errorTelefono}
          helperText={errorTelefono ? 'El contacto es requerido' : ''}
        />
            
         
          <br />
        </div>
        <br />
        <button className="button" type="submit" style={{
                                  "padding": "5px", 
                                  "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                                  "font-size": "16px", "font-weight": "bold", "width": "150px"
                              }}>
            Enviar
          </button>
      </Box>
    
    </div>

  )

}

