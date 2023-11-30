const cookieService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),

  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (refreshToken) => localStorage.setItem('refreshToken', refreshToken),
  removeRefreshToken: () => localStorage.removeItem('refreshToken'),
};

export default cookieService;