import { useEffect, useState } from "react";
import RequiredFieldError from "../../utils/errors";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export function CoccionesForm() {
    const [fecha_coccion, setFechaCoccion] = useState("");
    const [errorFechaCoccion, setErrorFechaCoccion] = useState(false);

    const [seleccionarReceta, setSeleccionarReceta] = useState([]);
    const [receta_id, setRecetaId] = useState("");
    const [errorRecetaId, setErrorRecetaId] = useState(false);

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
        }

        try {
            if (fecha_coccion.trim() === "") {
                setErrorFechaCoccion(true);
                setFechaCoccion("");
                throw RequiredFieldError('Este campo es obligatorio');
            }

            if (receta_id.trim() === "") {
                setErrorRecetaId(true);
                setRecetaId("");
                throw RequiredFieldError('Este campo es obligatorio');
            } else {
                setErrorRecetaId(false);
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
            if (receta_id.trim() === "") {
                setErrorRecetaId(true);
                setRecetaId("");
            } else {
                setErrorRecetaId(false);
            }

            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el formulario',
                icon: 'error',
                confirmButtonText: 'OK'
              });
        }
    };

    const driverAction = () => {
        const driverObj = driver({
          popoverClass: 'driverjs-theme',
          showProgress: true,
          steps: [
            { element: '.section-content-form', popover: { title: 'Nueva cocción', description: 'Aquí podrás registrar una nueva cocción', side: "left", align: 'start' }},
            { element: '.campos', popover: { title: 'Datos', description: 'En los campos vas cargando los datos de la cocción', side: "right", align: 'start' }},
            { element: '.btn-guardar', popover: { title: 'Guardar', description: 'Una vez cargados los datos, presiona Guardar para registrarlo', side: "right", align: 'start' }},
            { popover: { title: 'Eso es todo!', description: 'Ya puedes continuar' } }
          ],
          nextBtnText: 'Próximo',
          prevBtnText: 'Anterior',
          doneBtnText: 'Finalizar',
          progressText: '{{current}} de {{total}}',
        });
        driverObj.drive()
      };

    return (
        <div className="section-content-form">
            
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
                <div className="campos">
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
                    <br />
                </div>
                <br />
                <button className="button-guardar btn-guardar" type="submit">
                    Guardar
                </button>
                </Box>
                <div className='btn-ayuda'>
                    <button onClick={driverAction} className='button-ayuda'><FontAwesomeIcon icon={faQuestion} style={{color: "#ffffff",}} /></button>
                </div>
        </div>
    );
}