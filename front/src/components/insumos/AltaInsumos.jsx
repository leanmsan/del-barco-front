import React, { useEffect, useState } from "react";
import "../../css/form.css";

export function AltaInsumos() {
  const [descripcion, setDescripcion] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState(false);

  const [cantidad_disponible, setCantidad_disponible] = useState("");
  const [errorCantidad_disponible, setErrorCantidad_disponible] = useState(false);

  const [tipo_medida, setTipo_medida] = useState("");
  const [errorTipo_medida, setErrorTipo_medida] = useState(false);

  const [categoria, setCategoria] = useState("");
  const [errorCategoria, setErrorCategoria] = useState(false);

  const [precio_unitario, setPrecio_unitario] = useState(0);
  const [errorPrecio_unitario, setErrorPrecio_unitario] = useState(false);

  const [proveedor_id, setProveedor_id] = useState({});
  const [errorProveedor_id, setErrorProveedor_id] = useState(false);

  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

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

    const insumo = {
      descripcion,
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

      if (descripcion.trim() === "") {
        setErrorDescripcion(true);
      } else {
        setErrorDescripcion(false);
      }

      if (cantidad_disponible.trim() === "") {
        setErrorCantidad_disponible(true);
      } else {
        setErrorCantidad_disponible(false);
      }

      if (tipo_medida.trim() === "") {
        setErrorTipo_medida(true);
      } else {
        setErrorTipo_medida(false);
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
            Descripción
            <input
              type="text"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setErrorDescripcion(false);
              }}
            />
            {errorDescripcion && (
              <div className="error-message">La descripción es requerida</div>
            )}
          </label>
          <br />
          <label>
            Cantidad disponible
            <input
              type="text"
              value={cantidad_disponible}
              onChange={(e) => {
                setCantidad_disponible(e.target.value);
                setErrorCantidad_disponible(false);
              }}
            />
            {errorCantidad_disponible && (
              <div className="error-message">
                La cantidad disponible es requerida
              </div>
            )}
          </label>
          <br />
          <label>
            Tipo de medida
            <select
              value={tipo_medida}
              onChange={(e) => {
                setTipo_medida(e.target.value);
                setErrorTipo_medida(false);
              }}
            >
              <option value="">Selecciona la unidad de medida</option>
              {unidadesDeMedida.map((unidad, index) => (
                <option key={index} value={unidad}>
                  {unidad}
                </option>
              ))}
            </select>
            {errorTipo_medida && (
              <div className="error-message">
                La unidad de medida es requerida
              </div>
            )}
          </label>
          <br />
          <label>
            Categoría
            <input
              type="text"
              value={categoria}
              onChange={(e) => {
                setCategoria(e.target.value);
                setErrorCategoria(false);
              }}
            />
            {errorCategoria && (
              <div className="error-message">La categoría es requerida</div>
            )}
          </label>
          <br />
          <label>
            Precio Unitario
            <input
              type="text"
              value={precio_unitario}
              onChange={(e) => {
                setPrecio_unitario(e.target.value);
                setErrorPrecio_unitario(false);
              }}
            />
            {errorPrecio_unitario && (
              <div className="error-message">
                El precio unitario es requerido
              </div>
            )}
          </label>
          <br />
          <label>
            Proveedor
            <select
              value={proveedorSeleccionado}
              onChange={(e) => {
                setProveedorSeleccionado(e.target.value);
                setErrorProveedor_id(false);
              }}
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idproveedor} value={proveedor.idproveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
            {errorProveedor_id && (
              <div className="error-message">Selecciona un proveedor</div>
            )}
          </label>
          <br />

          <br />
        </div>

        <button className="button" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
