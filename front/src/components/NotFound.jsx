// NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import img_404 from '../assets/img/img_404.png';

import '../css/not-found.css'

export const NotFound = () => {
  // Obtiene la función de navegación
  const navigate = useNavigate();

  // Función para manejar el clic del botón
  const handleClick = () => {
    // Redirige a la página de inicio
    navigate('/');
  };

  return (
    <div className='not-found'>
      <img className="img-not-found" src={img_404} alt="Error 404" />
      <div className='txt-not-found'>
        <h1 className='title-not-found'>Error 404</h1>
        <h2 className='subtitle-not-found'>Por aquí no hay cerveza</h2>
        <p className='p-not-found'>Lo sentimos, la página que estás buscando no existe.</p>
        <button className='btn-volver' onClick={handleClick}>Volver a inicio
            </button>
      </div>
      
    </div>
  );
};

export default NotFound;