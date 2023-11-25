import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from 'axios';
import Swal from 'sweetalert2';

export function PasswordResetRequest() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/password-reset/', { 'email': email });
        if (res.status === 200) {
          Swal.fire({
            title: "Correo Enviado",
            text: "Se ha enviado un correo electrónico con el enlace de recuperación",
            icon: "success",
            didClose: () => {
              navigate('/login');
            }
          });
          console.log(res.data);
        }
      } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        Swal.fire({
          title: "Correo no enviado",
          text: "No se pudo enviar el correo electrónico ya que la dirección proporcionada no está registrada.",
          icon: "error"
        });
      } finally {
        setEmail("");
      }
    } else {
      setEmailError(true);
    }
  };

  return (
    <div>
      <Container component="div" maxWidth="sm" className="material-ui-container">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="form-box"
        >
          <Typography component="h2" variant="h6">
            Ingresa tu Email
          </Typography>
          <br />
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            Proporciona tu dirección de correo electrónico registrada para recuperar tu cuenta.
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError && 'Por favor, ingresa tu correo electrónico'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='submitButton'
            >
              Enviar
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  )
}
