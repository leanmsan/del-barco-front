import { useState } from "react";
import navegate from "react";
import "../../css/form.css"
import RequiredFieldError from "../../utils/errors";

export function AltaProveedores() {

  const [nombre_proveedor, setNombre] = useState("");
  const [errorNombre, setErrorNombre] = useState(false);

  const [mail, setMail] = useState("");
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
        setTelefono("");
        setErrorTelefono(true);
        throw new Error('Este campo es obligatorio');
      } else {
        setErrorTelefono(false)
      }

      const response = await fetch('http://127.0.0.1:8000/api/proveedores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor)
      })

      if (response.ok) {
        console.log(response, "esto es response")
        console.log('proveedor creado exitosamente')
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
    }
  }
  return (
    <div className='section-content' style={{ "width": "100%", "max-width": "300px", "min-width": "200px" }}>
      <form className='form' onSubmit={handleSubmit}>
        <h1 className='title' >Alta de Proveedores</h1>
        <div className='input-control'>

          <label>Nombre</label>
          <input
            type='text'
            name='nombre'
            required
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
            required
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
            required
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
      </form>
    </div>

  )

}

