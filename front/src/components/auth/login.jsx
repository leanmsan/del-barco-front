import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import imagenlogin from '../../assets/img/Logo1.png'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "../../css/login.css"

export function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [logindata, setLogindata] = useState({
    email: "",
    password: ""
  })

  const handleOnchange = (e) => {
    setLogindata({ ...logindata, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (logindata) {
      try {
        const res = await apiService.post('login/', logindata);
        const response = res.data;
        const user = {
          'full_name': response.full_name,
          'email': response.email,
        };

        if (res.status === 200) {
          localStorage.setItem('token', JSON.stringify(response.access_token));
          localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token));
          localStorage.setItem('user', JSON.stringify(user));

          console.log('Token de acceso guardado:', response.access_token);
          console.log('Token de actualización guardado:', response.refresh_token);
          setError(false);
          navigate('/');
        } else {
          console.log('Algo salió mal');
          setError(true);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setError(true);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="imagen-login">
        <img className="login-imagen" src={imagenlogin} alt="" />
      </div>
      <div className="login">
        <Container component="main" maxWidth="sm" className="material-ui-container">
          <Box
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="form-box"
          >
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoFocus
                value={logindata.email}
                onChange={handleOnchange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                value={logindata.password}
                onChange={handleOnchange}
                error={error}
                helperText={error && 'El correo o la contraseña no son válidos'}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className='submitButton'
              >
                Iniciar Sesión
              </Button>
              
              <Grid container>
                <Grid item xs>
                  <Link href="/forget-password" variant="body2">
                    Olvidaste tu contraseña?
                  </Link>
                </Grid>
                <Grid item>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  )
}
