import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export const TablaCocciones = () => {
    const [cocciones, setCocciones] = useState([]);
    const [tablaCocciones, setTablaCocciones] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const handleChange = (event) => {
        setBusqueda(event.target.value);
        filtrar(event.target.value);
    }

    const descargarInforme = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/informe_cocciones/');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'informe.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

    const filtrar = (terminoBusqueda) => {
        let resultadoBusqueda = tablaCocciones.filter((elemento) => {
            if(elemento.receta_id.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())) {
                return elemento.receta_id.toLowerCase().includes(terminoBusqueda.toLowerCase());
            }
        });

        setCocciones(resultadoBusqueda);
    }

    useEffect (() => {
        fetchData();
    }, []);

    const fetchData = async (searchTerm = '') => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/cocciones/?search=${searchTerm}`);
            setCocciones(response.data.cocciones)
            setTablaCocciones(response.data.cocciones)
        } catch (error) {
            console.log('Error al obtener los datos:', error);
        }
    };

    const driverAction = () => {
        const driverObj = driver({
          popoverClass: 'driverjs-theme',
          showProgress: true,
          steps: [
            { element: '.section-content', popover: { title: 'Cocciones', description: 'Aquí podrás ver los datos de las cocciones', side: "left", align: 'start' }},
            { element: '.tabla-cocciones', popover: { title: 'Lista de cocciones', description: 'Aquí podrás ver el listado de todos los ingresos', side: "right", align: 'start' }},
            { element: '.search-box', popover: { title: 'Buscar', description: 'Si no encuentras lo que buscas, puedes ingresar el nombre de la receta para encontrarla', side: "right", align: 'start' }},
            { element: '.btn-create', popover: { title: 'Nueva cocción', description: 'También puedes ir a registrar una nueva cocción directamente!', side: "right", align: 'start' }},
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
        <div className="section-content">
            <h1 className="title">Cocciones</h1>
            
            <div className="search-box">
                <button className="btn-search">
                    <FontAwesomeIcon icon={faSearch} style={{ color: "#ffffff" }} />
                </button>
                <input className="input-search" type="text" placeholder="Buscar..." 
                value={busqueda} onChange={handleChange}
                />
                <Link to='/nuevacoccion'>
                    <button className='btn-create'>+ Nueva cocción</button>
                </Link>
                <button onClick={descargarInforme}>Descargar Informe</button>
            </div>
            <TableContainer component={Paper} class="table-container-format tabla-cocciones">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell class="cell-head-TableContainer">Receta</TableCell>
                            <TableCell class="cell-head-TableContainer">Fecha</TableCell>
                            <TableCell class="cell-head-TableContainer">Volumen producido en litros</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cocciones.map((row) => (
                            <TableRow key={row.idcoccion}>
                                <TableCell>{row.receta_id}</TableCell>
                                <TableCell>{row.fecha_coccion}</TableCell>
                                <TableCell>{row.volumen_producido}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div  style={{ position: 'absolute', top: 0, right: 0, margin: '1.5rem' }}>
                    <button onClick={driverAction}><FontAwesomeIcon icon={faQuestion} style={{color: "#ffffff",}} /></button>
                </div>
        </div>
    );
};