import Slider from 'react-slick';
import 'slick-carousel/slick/slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'
import { SideBar } from './SideBar';
import '../css/inicio.css'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

// importacion de imagenes para el slider
import img1 from '../assets/img/img-1.png';
import img2 from '../assets/img/img-2.png';
import img3 from '../assets/img/img-3.png';
import img4 from '../assets/img/img-4.png';
import img5 from '../assets/img/img-5.png';
import img6 from '../assets/img/img-6.png';

export const Inicio = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const driverAction = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      showProgress: true,
      steps: [
        { popover: { title: 'Bienvenido!', description: 'Esta es la página principal', side: "left", align: 'start' }},
        { element: '#side-bar', popover: { title: 'Navegación', description: 'Desde esta sección podrás navegar por todas las funciones', side: "right", align: 'start' }},
        { element: 'html', popover: { title: 'Eso es todo por ahora', description: 'Esperemos que puedas realizar todas las operaciones que necesites', side: "top", align: 'start' } }
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive()
  }


  return (
    <div class="section-content" id='section-content'>
      <SideBar />
      <div className="home">
        <div className='home-title'>
          <h1 className='title'>Sistema de Gestión de Producción</h1>
        </div>
        <div className='slider-container'>
        <div className="photo-slider">
          <Slider {...settings}>
            <div>
              <img src={img1} alt="Imagen 1"/>
            </div>
            <div>
              <img src={img2} alt="Imagen 2"/>
            </div>
            <div>
              <img src={img3} alt="Imagen 3"/>
            </div>
            <div>
              <img src={img4} alt="Imagen 4"/>
            </div>
            <div>
              <img src={img5} alt="Imagen 5"/>
            </div>
            <div>
              <img src={img6} alt="Imagen 6"/>
            </div>
          </Slider>
        </div>
          <div  style={{ position: 'absolute', top: 0, right: 0, margin: '1.5rem' }}>
            <button onClick={driverAction}><FontAwesomeIcon icon={faQuestion} style={{color: "#ffffff",}} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
