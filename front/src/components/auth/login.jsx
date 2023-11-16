import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import cookieService from "../../services/cookieService";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await apiService.post('/token/', {
        username: username,
        password: password,
      });

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      cookieService.setToken(accessToken);
      cookieService.setRefreshToken(refreshToken);
      
      navigate('/');

    } catch (error) {
      setError('Error al iniciar sesión. Verifica las credenciales');
      console.log(error);
    }

  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ingresa tu usuario" />
        </label>
        <label>
          Contraseña <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" />
        </label>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
