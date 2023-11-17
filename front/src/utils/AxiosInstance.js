import axios from "axios";
import * as jwt_decode from 'jwt-decode';
import dayjs from "dayjs";
import cookieService from '../services/cookieService';

const baseURL = 'http://127.0.0.1:8000/api/';

const AxiosInstance = axios.create({
  baseURL: baseURL,
  'Content-type': 'application/json',
  headers: { Authorization: cookieService.getToken() ? `Bearer ${cookieService.getToken()}` : "" },
});

AxiosInstance.interceptors.request.use(async (req) => {
  const accessToken = cookieService.getToken();

  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
    const user = jwt_decode.default(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    try {
      const response = await axios.post(`${baseURL}auth/token/refresh/`, {
        refresh: cookieService.getRefreshToken(),
      });

      cookieService.setToken(response.data.access);
      req.headers.Authorization = `Bearer ${response.data.access}`;
      return req;
    } catch (renewError) {
      console.error('Error al renovar el token:', renewError);
      throw renewError;
    }
  } else {
    return req;
  }
});

export default AxiosInstance;
