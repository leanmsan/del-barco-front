import { useState } from "react";
import navegate from "react";
import "../../css/form.css"

export function AltaProveedores () {
    // const [idproveedor, setIdProveedor] = useState("");
    // const [errorIdProveedor, setErrorIdProveedor] = useState(false);

    const [nombre, setNombre] = useState("");
    const [errorNombre, setErrorNombre] = useState(false);

    const [mail, setMail] = useState("");
    const [errorMail, setErrorMail] = useState(false);

    const [telefono, setTelefono] = useState("");
    const [errorTelefono, setErrorTelefono] = useState(false);

    const [estado, setEstado] = useState("");
    const [errorEstado, setErrorEstado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const proveedor = {
            nombre,
            mail,
            telefono,
            estado,
          };
    
         try {
            const response = await fetch('http://127.0.0.1:8000/api/proveedores/', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proveedor)
            })
            
            if (nombre.trim() === '') {
              setErrorNombre(true);
            }else{
              setErrorNombre(false)
            }

            if (mail.trim() === '') {
              setErrorMail(true);
            }else{
              setErrorMail(false)
            }
            
            if (telefono.trim() === '') {
              setErrorTelefono(true);
            }else{
              setErrorTelefono(false)
            }

            if (estado.trim() !== 'A' && estado.trim() !== 'I') {
              setErrorEstado(true);
            }else{
              setErrorEstado(false)
            }

            if (response.ok) {
                console.log(response, "esto es response")
                console.log('proveedor creado exitosamente')
                navegate('/proveedores')
            } else {
                console.log('error al crear el proveedor')
            }
         } catch (error) {
            console.log('error de red', error)
         }
    }
    return (
        <div className='container'>
          <form className='form' onSubmit={handleSubmit}>
            <h1 className='title' >Alta de Proveedores</h1>
          <div className='input-control'
          >
            {/* <label>ID</label>
            <input
              type='text'
              name='idproveedor'
              onChange={(e) => {setIdProveedor(e.target.value)
                setErrorIdProveedor(false)}}
            />
            {errorNombre && <div className='error-message'>El nombre es requerido</div>}
            <br /> */}

            <label>Nombre</label>
            <input
              type='text'
              name='nombre'
              onChange={(e) => {setNombre(e.target.value)
                setErrorNombre(false)}}
            />
            {errorNombre && <div className='error-message'>El nombre es requerido</div>}
            <br />

            <label>Mail</label>
            <input
              type='text'
              name='mail'
              onChange={(e) => {setMail(e.target.value)
                setErrorMail(false) }}
            />
            {errorMail && <div className='error-message'>La provincia es requerido</div>}
            <br />

            <label>Contacto</label>
            <input
              type='text'
              name='telefono'
              onChange={(e) => {setTelefono(e.target.value)
                setErrorTelefono(false)}}
            />
            {errorTelefono && <div className='error-message'>El contacto es requerido</div>}
            <br />

            <label>Estado (A o I)</label>
            <input
              type='text'
              name='estado'
              onChange={(e) => {setEstado(e.target.value)
                setErrorEstado(false)}}
            />
            {errorEstado && <div className='error-message'>El estado ingresado es invalido o esta vacio</div>}
          </div>
        <button className='button' type="submit">Enviar</button>
      </form>
      </div>
      
    )

}

