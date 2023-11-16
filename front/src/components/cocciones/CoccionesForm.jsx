import { useEffect, useState } from "react";
import "../../css/form.css";
import RequiredFieldError from "../../utils/errors";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function CoccionesForm() {
    const [fecha_coccion, setFechaCoccion] = useState("");
    const [errorFechaCoccion, setErrorFechaCoccion] = useState(false);

    const [seleccionarReceta, setSeleccionarReceta] = useState([]);
    const [receta_id, setRecetaId] = useState("");
    const [errorRecetaId, setErrorRecetaId] = useState(false);

    const [volumen_producido, setVolumenProducido] = useState("")
    const [errorVolumenProducido, setErrorVolumenProducido] = useState(false);
    
    const navegate = useNavigate()

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

                Swal.fire({
                    title: 'Éxito',
                    text: 'La cocción se registró correctamente!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    navegate('/cocciones')
                  })
            } else {
                console.log("Error al enviar el formulario");
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar el formulario',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
            }
            
        } catch (error) {
            if (error instanceof RequiredFieldError) {
                console.log('Este campo es obligatorio');
            } else {
                console.log('Error en la solicitud POST', error);
            }
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el formulario',
                icon: 'error',
                confirmButtonText: 'OK'
              });
        }
    };

    return (
        <div className="section-content-form">
            {/* <form className="form" onSubmit={handleSubmit}>
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
                <h1 className="title">Nueva coccion</h1>
                <div>
                <TextField
                    required
                    id="outlined-required"
                    label="Fecha"
                    type="date"
                    InputLabelProps={{
                        shrink: true, // Esto evita la superposición del label
                      }}
                    value={fecha_coccion}
                    onChange={(e) => {
                            setFechaCoccion(e.target.value);
                            setErrorFechaCoccion(false);
                        }}
                    error={errorFechaCoccion}
                    helperText={errorFechaCoccion ? 'La fecha es requerida' : ''}
                    />

                <TextField
                    required
                    id="outlined-select-currency"
                    select
                    label="Receta"
                    value={receta_id}
                    onChange={(e) => {
                        setRecetaId(e.target.value);
                        setErrorRecetaId(false);
                    }} 
                    error={errorRecetaId}
                    helperText={errorRecetaId && 'La receta es requerida'}
                    >
                    <MenuItem value="" disabled>
                        Selecciona una receta
                    </MenuItem>
                    {seleccionarReceta.map((receta) => (
                                <MenuItem key={receta.idreceta} value={receta.nombre_receta}>
                                    {receta.nombre_receta}
                                </MenuItem>
                            ))}
                    </TextField>

                    <TextField
                    required
                    id="outlined-number"
                    label="Volumen producido en litros"
                    type="number"
                    value={volumen_producido}
                    onChange={(e) => {
                        setVolumenProducido(e.target.value);
                        setErrorVolumenProducido(false);
                    }}
                    error={errorVolumenProducido}
                    helperText={errorVolumenProducido ? 'La cantidad es requerida' : ''}
                    />
                    
                    <br />
                </div>
                <br />
                <button className="button-guardar" type="submit">
                    Guardar
                </button>
                </Box>

        </div>
    );
}