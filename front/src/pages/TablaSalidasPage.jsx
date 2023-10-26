
import { SideBar } from "../components/SideBar"
import { TablaSalidasMovimientos } from "../components/movimientos/salidas/TablaSalida"


export function TablaSalida(){
    return (
        <div>
            <SideBar />
            <TablaSalidasMovimientos/>
        </div>
    )
}