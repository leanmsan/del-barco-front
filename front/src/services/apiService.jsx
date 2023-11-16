import axios from 'axios';
import cookieService from './cookieService';
import { useNavigate } from 'react-router-dom';

const apiService = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

const renewAccessToken = async () => {
  try {
    const refreshToken = cookieService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No se encontró el refresh token.');
    }

    const response = await apiService.post('/token/refresh/', {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    cookieService.setToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error al renovar el token:', error);
    throw error;
  }
};

// Función para manejar errores de la renovación de token
const handleTokenRenewError = (error, navigate) => {
  console.error('Error en el interceptor de respuesta:', error);

  // Redirige al usuario al inicio de sesión o maneja el error de renovación de token según tus necesidades
  navigate('/login');
};

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // Si el error es debido a un token expirado y se intenta renovar el token
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      const navigate = useNavigate();

      try {
        const newAccessToken = await renewAccessToken();
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiService(originalConfig);
      } catch (renewError) {
        handleTokenRenewError(renewError, navigate);
      }
    }

    return Promise.reject(error);
  }
);

export default apiService;
