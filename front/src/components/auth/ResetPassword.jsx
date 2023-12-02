import { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//import axios from 'axios';
import Swal from 'sweetalert2';

export function ResetPassword() {
  const { uid, token } = useParams()
  const [password, setPassword] = useState("");
  const [errorPassword, setPasswordError] = useState(false);

  const [password2, setPassword2] = useState("");
  const [password2ErrorMessage, setPassword2ErrorMessage] = useState("");
  const [errorPassword2, setPassword2Error] = useState(false);

  const navigate = useNavigate()

  // const handleSubmit2 = async (e) => {
  //   e.preventDefault()

  //   const data = {
  //     "password": password,
  //     "confirm_password": password2,
  //     "uidb64": uid,
  //     "token": token,
  //   }

  //   if (data) {
  //     const res = await axios.patch('http://127.0.0.1:8000/api/change-password/', data)
  //     const response = res.data
  //     if (res.status === 200) {

  //       let timerInterval;
  //       Swal.fire({
  //         title: "La contraseña se ha cambiado correctamente!",
  //         timer: 2000,
  //         timerProgressBar: true,
  //         didOpen: () => {
  //           Swal.showLoading();
  //           const timer = Swal.getPopup().querySelector("b");
  //           timerInterval = setInterval(() => {
  //             timer.textContent = `${Swal.getTimerLeft()}`;
  //           }, 100);
  //         },
  //         willClose: () => {
  //           clearInterval(timerInterval);
  //         }
  //       }).then((result) => {
  //         /* Read more about handling dismissals below */
  //         if (result.dismiss === Swal.DismissReason.timer) {
  //           console.log("I was closed by the timer");
  //         }
  //       });

  //       navigate('/login')
  //     }
  //     console.log(response)
  //   }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      "password": password,
      "confirm_password": password2,
      "uidb64": uid,
      "token": token,
    }

    try {
      // Validar campos requeridos del lado del cliente
      if (!password || !password2) {
        // Manejar errores de campo requerido de manera más específica
        if (password.trim() === "") {
          setPasswordError(true);
          setPassword("");
        }

        if (password2.trim() === "") {
          setPassword2Error(true);
          setPassword2ErrorMessage('La confirmación de la contraseña es requerida');
          setPassword2("");
        }

        throw new Error('Todos los campos son obligatorios');
      }

      const response = await fetch('http://127.0.0.1:8000/api/change-password/', {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        // Manejar éxito
        const responseData = await response.json();
        Swal.fire({
          title: "Éxito!",
          text: "Se ha reestablecido la contraseña correctamente.",
          icon: "success",
          confirmButtonText: 'OK',
          didClose: () => {
            navigate('/login');
          }
        });
        console.log(responseData);
      } else {
        // Manejar errores de respuesta del servidor
        const errorData = await response.json();
        console.log('Error Data:', errorData);

        if (errorData.non_field_errors) {
          // Modificar la condición para verificar si hay algún mensaje de error
          if (errorData.non_field_errors[0] === "Link is invalid or has expired") {
            // Manejar específicamente el caso de enlace no válido o expirado
            Swal.fire({
              title: 'Error',
              text: 'El enlace para restablecer la contraseña es inválido o ha expirado.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            // Otros errores de respuesta del servidor
            // Manejar otros errores de respuesta del servidor
            setPassword2Error(true);
            setPassword2ErrorMessage('Las contraseñas no coinciden');
            Swal.fire({
              title: 'Error',
              text: 'Se produjo un error. Por favor, vuelva a intentar.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } else {
          // Otros errores no relacionados con el enlace inválido o expirado
          Swal.fire({
            title: 'Error',
            text: 'Se produjo un error. Por favor, vuelva a intentar.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    } catch (error) {
      // Manejar errores de red y otros errores inesperados
      Swal.fire({
        title: 'Error',
        text: 'Se produjo un error. Por favor, vuelva a intentar.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      //console.log('Se produjo un error al registrar el usuario', error);
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
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              error={errorPassword}
              helperText={errorPassword && 'La contraseña es requerida'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="confirm_password"
              label="Confirma tu contraseña"
              autoComplete="new-password"
              value={password2}
              name="confirm_password"
              onChange={(e) => {
                setPassword2(e.target.value);
                setPassword2Error(false);
              }}
              error={errorPassword2}
              helperText={errorPassword2 && password2ErrorMessage}
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


