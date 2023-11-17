import { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from 'axios';
import Swal from 'sweetalert2';

export function ResetPassword() {
  const navigate = useNavigate()
  const { uid, token } = useParams()
  const [newpasswords, setNewPassword] = useState({
    password: "",
    confirm_password: "",
  })
  const { password, confirm_password } = newpasswords

  const handleChange = (e) => {
    setNewPassword({ ...newpasswords, [e.target.name]: e.target.value })
  }

  const data = {
    "password": password,
    "confirm_password": confirm_password,
    "uidb64": uid,
    "token": token,
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (data) {
      const res = await axios.patch('http://127.0.0.1:8000/api/change-password/', data)
      const response = res.data
      if (res.status === 200) {

        let timerInterval;
        Swal.fire({
          title: "La contraseña se ha cambiado correctamente!",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });

        navigate('/login')
      }
      console.log(response)
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
            Ingresa tu Nueva Contraseña
          </Typography>
          <br />
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            Por favor, ingresa tu nueva contraseña. Debe contener al menos 6 caracteres.
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="password"
              label="Nueva contraseña"
              name="password"
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="confirm_password"
              label="Confirma tu contraseña"
              name="confirm_password"
              autoComplete="new-password"
              value={confirm_password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='submitButton'
            >
              Guardar
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  )
}
