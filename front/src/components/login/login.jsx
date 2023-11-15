//import { useState, useEffect } from "react";

export function Login() {


    return (
        <di>
            <h1>Login</h1>
            <form>
                <label>Usuario <input type="text" name="username" placeholder="Ingresa tu usuario" /></label>
                <label>Contraseña <input type="password" name="password" placeholder="Ingresa tu contraseña" /></label>
                <button type="submit">Iniciar Sesion</button>
            </form>
        </di>
    )
}