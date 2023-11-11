import { useEffect, useState } from "react";
import "../../css/form.css";
import RequiredFieldError from "../../utils/errors";

export function CoccionesForm() {
    const [fecha_coccion, setFechaCoccion] = useState("");
    const [errorFechaCoccion, setErrorFechaCoccion] = useState(false);

    const [seleccionarReceta, setSeleccionarReceta] = useState([]);
    const [receta_id, setRecetaId] = useState("");
    const [errorRecetaId, setErrorRecetaId] = useState(false);

    const [volumen_producido, setVolumenProducido] = useState("")
    const [errorVolumenProducido, setErrorVolumenProducido] = useState(false);

    // listado de recetas
    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/recetas/');
                const data = await response.json();

                if (response.ok) {
                    setSeleccionarReceta(data.recetas);
                    //console.log('Esto es recetas', seleccionarReceta);
                } else {
                    console.log('Error al obtener las recetas', response);
                }
            } catch (error) {
                console.log('Error de red', error);
            }
        };

        fetchRecetas();
    }, []);

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const conccion = {
            fecha_coccion,
            receta_id,
            volumen_producido,
        }

        try {
            if (receta_id.trim() === "") {
                setErrorRecetaId(true);
                setRecetaId("");
                throw new RequiredFieldError('Este campo es obligatorio');
            } else {
                setErrorRecetaId(false);
            }

            if (volumen_producido.trim() === "") {
                setErrorVolumenProducido(true);
                setVolumenProducido("");
                throw new RequiredFieldError('Este campo es obligatorio');
            } else {
                setErrorVolumenProducido(false);
            }

            const response = await fetch("http://127.0.0.1:8000/api/cocciones/", {
                method: "POST",
                headers: {
                    "Content-Type": "aplication/json",
                },
                body: JSON.stringify(conccion),
            });

            if (response.ok) {
                console.log("El formulario se envió correctamente");
            } else {
                console.log("Error al enviar el formulario");
            }
            
        } catch (error) {
            if (error instanceof RequiredFieldError) {
                console.log('Este campo es obligatorio');
            } else {
                console.log('Error en la solicitud POST', error);
            }
        }
    };

    return (
        <div className="section-content" style={{"width": "100%", "max-width": "300px", "min-width": "200px"}}>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Nueva Cocción</h1>
                <div className="input-control">
                    <label>Fecha
                        <input type="date" name="fecha" onChange={(e) => {
                            setFechaCoccion(e.target.value);
                            setErrorFechaCoccion(false);
                        }}/>
                        {errorFechaCoccion && (
                            <div className="error-message">Tienes que seleccionar una fecha</div>
                        )}
                    </label>
                    <label>Receta
                        <select value={receta_id} onChange={(e) => {
                            setRecetaId(e.target.value);
                            setErrorRecetaId(false);
                        }}>
                            <option value="">Seleccione una receta</option>
                            {seleccionarReceta.map((receta) => (
                                <option key={receta.idreceta} value={receta.nombre_receta}>
                                    {receta.nombre_receta}
                                </option>
                            ))}
                        </select>
                        {errorRecetaId && (
                            <div className="error-message">Tienes que seleccionar una receta</div>
                        )}
                    </label>
                    <label>Volumen Producido
                        <input type="number" name="volumen-producido" onChange={(e) => {
                            setVolumenProducido(e.target.value);
                            setErrorVolumenProducido(false);
                        }}/>
                        {errorVolumenProducido && (
                            <div className="error-message">Tienes que especificar el volumen producido</div>
                        )}
                    </label>
                </div>
                <button className="button" type="submit"  style={{
                                "padding": "5px",
                                "color": "white", "background-color": "#7e530f ", "border-radius": "4px", "border": "none",
                                "font-size": "16px", "font-weight": "bold", "width": "100%"
                            }}>Enviar</button>
            </form>
        </div>
    );
}