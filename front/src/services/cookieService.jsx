import Cookies from 'js-cookie';

const cookieService = {
  getToken: () => Cookies.get('token'),
  setToken: (token) => Cookies.set('token', token, { expires: 1 }),
  removeToken: () => Cookies.remove('token'),

  getRefreshToken: () => Cookies.get('refreshToken'),
  setRefreshToken: (refreshToken) => Cookies.set('refreshToken', refreshToken, { expires: 7 }),
  removeRefreshToken: () => Cookies.remove('refreshToken'),
};

export default cookieService;
