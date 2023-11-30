import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function CustomTextField({ value, onChange }) {
  return (
    <TextField
      className="input-search"
      label="Buscar..."
      type="text"
      value={value}
      onChange={onChange}
      InputLabelProps={{
        style: { fontFamily: "Poppins, sans-serif" },
      }}
      InputProps={{
        style: { fontFamily: "Poppins, sans-serif" },
        endAdornment: (
          <InputAdornment>
            <FontAwesomeIcon icon={faSearch} style={{ color: "#404040" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiInputLabel-root": {
          color: "#7e530f", // color del label cuando el TextField está enfocado
        },
        "&.Mui-focused label": {
          color: "#7e530f", // color del label cuando el TextField está enfocado
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: "#7e530f", // color del borde siempre
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#7e530f", // color del borde cuando el TextField está enfocado
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#7e530f", // color del borde cuando el mouse está sobre el TextField
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#7e530f", // color del borde siempre (para variant="outlined")
          },
          "&:hover fieldset": {
            borderColor: "#7e530f", // color del borde cuando el mouse está sobre el TextField (para variant="outlined")
          },
          "&.Mui-focused fieldset": {
            borderColor: "#7e530f", // color del borde cuando el TextField está enfocado (para variant="outlined")
          },
        },
      }}
    />
  );
}

export default CustomTextField;
