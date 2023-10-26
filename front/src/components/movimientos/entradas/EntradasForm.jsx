import { useState, useEffect } from "react";
import "../../../css/form.css";
import { useNavigate } from "react-router-dom";

export function EntradasForm() {
  //Cabecera
  const navegate = useNavigate();
  const [idproveedor_id, setIdProveedor] = useState("");
  const [errorIdProveedor, setErrorIdProveedor] = useState(false);

  const [fecha, setFecha] = useState("");
  const [errorFecha, setErrorFecha] = useState(false);

  const [montototal, setMontoTotal] = useState("");
  const [errorMontoTotal, setErrorMontoTotal] = useState(false);

  const [proveedores, setProveedores] = useState([]);

  //Detalle
  const [identrada_id, setIdEntrada] = useState("");

  const [idproducto_id, setIdProducto] = useState("");
  const [errorProductoid, setErrorProductoid] = useState(false);

  const [cantidad, setCantidad] = useState(0);
  const [errorCantidad, setErrorCantidad] = useState(false);

  const [preciounitario, setPrecioUnitario] = useState("");
  const [errorPrecioUnitario, setErrorPrecioUnitario] = useState(false);

  const [productos, setProductos] = useState([]);

  const [lastInsertedId, setLastInsertedId] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/productos/");
        const data = await response.json();

        if (response.ok) {
          setProductos(data.productos);
        } else {
          console.log("error al obtener los productos");
        }
      } catch (error) {
        console.log("error de red", error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchLastInsertedId = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/entradas/");
        const data = await response.json();
        console.log("Esto es response", response);
        console.log("Esto es data", data);
        if (response.ok && data.entradas.length > 0) {
          const lastId = data.entradas[data.entradas.length - 1].identrada;
          console.log("Esto es lastid", lastId);
          setLastInsertedId(lastId);
          setIdEntrada(lastId);
        } else {
          console.log("error al obtener el último id de entrada");
        }
      } catch (error) {
        console.log("error de red", error);
      }
    };

    fetchLastInsertedId();
  }, []);

  //handlesubmit Cabecera
  const handleSubmitCabecera = async (e) => {
    e.preventDefault();

    const entrada = {
      idproveedor_id,
      fecha,
      montototal,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/entradas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entrada),
      });

      if (idproveedor_id.trim() === "") {
        setErrorIdProveedor(true);
      } else {
        setErrorIdProveedor(false);
      }

      if (fecha.trim() === "") {
        setErrorFecha(true);
      } else {
        setErrorFecha(false);
      }

      if (montototal.trim() === "") {
        setErrorMontoTotal(true);
      } else {
        setErrorMontoTotal(false);
      }

      if (response.ok) {
        console.log(response, "esto es response");
        console.log("entrada creada exitosamente");
        navegate("/registroentradas");
      } else {
        console.log("error al crear la entrada");
      }
    } catch (error) {
      console.log("error de red", error);
    }
  };

  //handlesubmint detalle
  const handleSubmitDetalle = async (e) => {
    e.preventDefault();

    const entradaDetalle = {
      identrada_id,
      idproducto_id,
      cantidad,
      preciounitario,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/entrada_detalles/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entradaDetalle),
        }
      );

      if (idproducto_id.trim() === "") {
        setErrorProductoid(true);
      } else {
        setErrorProductoid(false);
      }

      if (cantidad <= 0) {
        setErrorCantidad(true);
      } else {
        setErrorCantidad(false);
      }

      if (preciounitario.trim() === "") {
        setErrorPrecioUnitario(true);
      } else {
        setErrorPrecioUnitario(false);
      }

      if (response.ok) {
        console.log("detalle de entrada creado exitosamente");
        navigate("/entradas");
      } else {
        console.log("error al crear el detalle de entrada");
      }
    } catch (error) {
      console.log("error de red", error);
    }
  };

  //handlesubmit general
  const handlesubmint = async (e) => {
    e.preventDefault();
    handleSubmitCabecera();
    handleSubmitDetalle();
  };

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        // Obtener la lista de proveedores
        const response = await fetch("http://127.0.0.1:8000/api/proveedores/");
        const data = await response.json();

        if (response.ok) {
          setProveedores(data.proveedores);
        } else {
          console.log("error al obtener los proveedores");
        }
      } catch (error) {
        console.log("error de red", error);
      }
    };

    fetchProveedores();
  }, []);

  return (
    <div className="container">
      <form className="form" onSubmit={handlesubmint}>
        <h1 className="title">Registro de Entrada</h1>
        <div className="cabecera">
          <div className="input-control">
            <div className="input-control">
              <label>Proveedor</label>
              <select
                name="proveedor"
                value={idproveedor_id}
                onChange={(e) => {
                  setIdProveedor(e.target.value);
                  setErrorIdProveedor(false);
                }}
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option
                    key={proveedor.idproveedor}
                    value={proveedor.idproveedor}
                  >
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>
            {errorIdProveedor && (
              <div className="error-message">
                Es requerido que seleccion un proveedor
              </div>
            )}
            <br />
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              onChange={(e) => {
                setFecha(e.target.value);
                setErrorFecha(false);
              }}
            />
            {errorFecha && (
              <div className="error-message">
                Es requerido que ingrese una fecha
              </div>
            )}
            <br />

            <label>Monto Total</label>
            <input
              type="text"
              name="monto-total"
              onChange={(e) => {
                setMontoTotal(e.target.value);
                setErrorMontoTotal(false);
              }}
            />
            {errorMontoTotal && (
              <div className="error-message">
                Es requerido que ingrese un monto total
              </div>
            )}
          </div>
        </div>
        <div className="detalle">
          <div className="input-control">
            <input
              type="hidden"
              name="last-inserted-id"
              value={lastInsertedId}
            />
            <br />
            <label>Producto</label>
            <select
              name="producto"
              value={idproducto_id}
              onChange={(e) => {
                setIdProducto(e.target.value);
                setErrorProductoid(false);
              }}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.idproducto} value={producto.idproducto}>
                  {producto.nombre}
                </option>
              ))}
            </select>
            {errorProductoid && (
              <div className="error-message">
                Es requerido que seleccione un producto
              </div>
            )}
            <br />
            <label>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              onChange={(e) => {
                setCantidad(e.target.value);
                setErrorCantidad(false);
              }}
            />
            {errorCantidad && (
              <div className="error-message">
                Es requerido que ingrese una cantidad
              </div>
            )}
            <br />
            <label>Precio Unitario</label>
            <input
              type="text"
              name="precio-unitario"
              onChange={(e) => {
                setPrecioUnitario(e.target.value);
                setErrorPrecioUnitario(false);
              }}
            />
            {errorPrecioUnitario && (
              <div className="error-message">
                Es requerido que ingrese un precio unitario
              </div>
            )}
          </div>
        </div>
        <button className="button" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
