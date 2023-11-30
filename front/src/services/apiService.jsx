import axios from 'axios';
import cookieService from './cookieService';

const apiService = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
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

    // Asegúrate de que el nuevo token se esté almacenando correctamente
    cookieService.setToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error al renovar el token:', error);
    throw error;
  }
};

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const newAccessToken = await renewAccessToken();
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiService(originalConfig);
      } catch (renewError) {
        // Trata el error de renovación de token según tus necesidades
        if (renewError.message === 'No se encontró el refresh token.') {
          // Manejar el caso cuando no hay un refresh token
        } else {
          // Trata otros errores de renovación de token
        }
        console.error('Error al renovar el token:', renewError);
        throw renewError;
      }
    }

    return Promise.reject(error);
  }
);

const logout = async () => {
  try {
    await apiService.post('logout/');  // Ajusta la ruta del endpoint de cierre de sesión
    cookieService.removeToken();
    // Puedes añadir más líneas para eliminar otros tokens si es necesario
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};
export default apiService;