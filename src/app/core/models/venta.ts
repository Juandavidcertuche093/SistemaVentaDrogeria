import { DetalleVenta } from "./detalle-venta";

export interface Venta {
    idVenta?:number,
    numDocumento?:string,
    tipoPago:string,
    fechaRegistro?:string,
    totalTexto:string,
    IdUsuario:string
    usuarioDescripcion:string
    detalleventa: DetalleVenta[]
}

//el simbolo ? quiere decir que pueden entrar nulos