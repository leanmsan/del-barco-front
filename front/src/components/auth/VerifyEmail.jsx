import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Swal from 'sweetalert2';

export function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState(false)

  const navigate = useNavigate()

  const handleOtpSubmit = async (e) => {
    e.preventDefault()

    if (otp) {
      try {
        const res = await axios.post('http://localhost:8000/api/verify-email/', { 'otp': otp })
        //const resp = res.data
        if (res.status === 200) {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: true
          });
          
          swalWithBootstrapButtons.fire({
            title: "Email verificado!",
            text: "Tu dirección de correo fue verificada exitosamente.",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Ir al login",
            cancelButtonText: "Volver al inicio",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Acciones si el usuario confirma
              navigate('/login');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Acciones si el usuario cancela
              navigate('/');
            }
          });
          
        }
      } catch (error) {
        console.log('Error al verificar la dirección de correo:', error);
        Swal.fire({
          title: "Correo no verificado",
          text: "No se pudo verificar el correo electrónico.",
          icon: "error"
        });
      }

    } else {
      setOtpError(true);
    }

  }
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
            Verifica tu correo
          </Typography>
          <br />
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            Ingresa el código de verificación.
          </Typography>
          <form onSubmit={handleOtpSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Código de verificación"
              name="email"
              autoComplete="email"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={otpError}
              helperText={otpError && 'Por favor, ingresa un código de verificación válido.'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='submitButton'
            >
              Verificar
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  )
}
