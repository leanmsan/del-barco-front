import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import axios from "axios";

export const TablaCocciones = () => {
    const [cocciones, setCocciones] = useState([]);
    const [tablaCocciones, setTablaCocciones] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const handleChange = (event) => {
        setBusqueda(event.target.value);
        filtrar(event.target.value);
    }

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
    }

    return (
        <div className="section-content">
            <h1 className="title">Cocciones</h1>
            <div className="search-box">
                <button className="btn-search"><i className="fas fa-search"></i></button>
                <input className="input-search" type="text" placeholder="Buscar..." 
                value={busqueda} onChange={handleChange}
                />
            </div>
            <TableContainer component={Paper} class="table-container-format">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell class="cell-head-TableContainer">Receta</TableCell>
                            <TableCell class="cell-head-TableContainer">Fecha</TableCell>
                            <TableCell class="cell-head-TableContainer">Volumen Producido</TableCell>
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
        </div>
    );
};