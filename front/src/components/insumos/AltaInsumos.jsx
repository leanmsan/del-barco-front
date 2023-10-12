import React, { useEffect, useState } from "react";
import '../../css/form.css'

export function AltaInsumos() {

  const [descripcion, setDescripcion] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState(false);

  const [cantidad_disponible, setcantidad_disponible] = useState("");
  const [errorcantidad_disponible, setErrorcantidad_disponible] = useState(false);

  const [tipo_medida, settipo_medida] = useState("");
  const [errortipo_medida, setErrortipo_medidaa] = useState(false);

  const [categoria, setCategoria] = useState("");
  const [errorCategoria, setErrorCategoria] = useState(false);

  const [precio_unitario, setprecio_unitario] = useState(0);
  const [errorprecio_unitario, setErrorprecio_unitario] = useState(false);

  const [proveedor_id, setproveedor_id] = useState({});
  const [errorproveedor_id, setErrorproveedor_id] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();

    const insumo = {
        descripcion,
        cantidad_disponible,
        tipo_medida,
        categoria,
        precio_unitario,
        proveedor_id
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/insumos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(insumo),
      });

      if (descripcion.trim() === "") {
        setErrorDescripcion(true);
      } else {
        setErrorDescripcion(false);
      }

      if (cantidad_disponible.trim() === "") {
        setErrorcantidad_disponible(true);
      } else {
        setErrorcantidad_disponible(false);
      }

      if (tipo_medida.trim() === "") {
        setErrortipo_medidaa(true);
      } else {
        setErrortipo_medidaa(false);
      }

      if (categoria.trim() === "") {
        setErrorCategoria(true);
      } else {
        setErrorCategoria(false);
      }



      if (response.ok) {
        console.log("El formulario se envió correctamente");
      } else {
        console.log("Error al enviar el formulario");
      }
    } catch (error) {
      console.log("Error en la solicitud POST", error);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Alta de Insumos</h1>
        <div className="input-control">
          <label>
            Descripcion
            <input
              type="text"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setErrorDescripcion(false);
              }}
            />
            {errorDescripcion && (
              <div className="error-message">La descripcion es requerida</div>
            )}
          </label>
          <br />
          <label>
            Cantidad disponible
            <input
              type="text"
              value={cantidad_disponible}
              onChange={(e) => {
                setcantidad_disponible(e.target.value);
                setErrorcantidad_disponible(false);
              }}
            />
            {errorcantidad_disponible && (
              <div className="error-message">La cantidad disponible es requerida</div>
            )}
          </label>
          <br />
          <label>
            Tipo medida
            <input
              type="text"
              value={tipo_medida}
              onChange={(e) => {
                settipo_medida(e.target.value);
                setErrortipo_medidaa(false);
              }}
            />
            {errortipo_medida && (
              <div className="error-message">
                el tipo de medida es requerido
              </div>
            )}
          </label>
          <br />
          <label>
            Categoria
            <input
              type="text"
              value={categoria}
              onChange={(e) => {
                setCategoria(e.target.value);
                setErrorCategoria(false);
              }}
            />
            {errorCategoria && (
              <div className="error-message">
                La categoria es requerida
              </div>
            )}
          </label>
          <br />
          <label>
            Precio Unitario
            <input
              type="text"
              value={precio_unitario}
              onChange={(e) => {
                setprecio_unitario(e.target.value);
                setErrorprecio_unitario(false);
              }}
            />
            {errorprecio_unitario && (
              <div className="error-message">el precio unitario es requerido</div>
            )}
          </label>
          <br />
          <label>
            Proovedor
            <input
              type="text"
              value={proveedor_id}
              onChange={(e) => {
                setproveedor_id(e.target.value);
                setErrorproveedor_id(false);
              }}
            />
            {errorproveedor_id && (
              <div className="error-message">
                El stock disponible debe ser mayor a 0
              </div>
            )}
          </label>
          <br />
        </div>

        <button className="button" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
