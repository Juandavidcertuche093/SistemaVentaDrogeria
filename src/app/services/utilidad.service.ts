import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';//Este es un servicio de Angular Material que se usa para mostrar mensajes breves
import { Sesion } from '../core/models/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  //metodo para devolver un mensaje de alerta
  mostrarAlerta(mensaje: string, tipo: string) {
    this.snackBar.open(mensaje, tipo, {
      horizontalPosition: "center", // Centra horizontalmente
      verticalPosition: 'top',      // Mantiene la posición superior
      duration: 5000                // Duración de la alerta en milisegundos
    });
  }

  //Este método guarda la sesión del usuario en el localStoragecomo una cadena JSON.
  guardarSesionUsuario(usuarioSession: Partial<Sesion>){
    localStorage.setItem("usuario", JSON.stringify({
      idUsuario: usuarioSession.idUsuario,
      correo: usuarioSession.correo,
      rolDescripcion: usuarioSession.rolDescripcion
    }));
  }

  //Este método se encarga de recuperar la sesión del usuario desde el localStorage
  obtenerSesionUsuario() {
    if (typeof localStorage !== 'undefined') {
      const dataCadena = localStorage.getItem("usuario");
      if (dataCadena) {
        return JSON.parse(dataCadena);
      }
    }
    return null;
  }
}
