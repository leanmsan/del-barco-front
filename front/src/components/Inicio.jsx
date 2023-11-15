import Slider from 'react-slick';
import 'slick-carousel/slick/slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'
import { SideBar } from './SideBar';
import '../css/inicio.css'
import '../css/menu.css'

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
    autoplay: false,
    autoplaySpeed: 2000,
  };

  return (
    <div class="section-content">
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
        </div>
      </div>
    </div>
  );
};
