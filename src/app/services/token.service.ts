import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Método para guardar el token en una cookie
  saveToken(token: string){
    if (typeof document !== 'undefined'){ // Verificamos que el objeto document esté definido (para evitar errores en SSR)
      setCookie('token', token, {expires: 1, path: '/'}) //Utilizamos la función setCookie para almacenar el token en una cookie llamada 'token'
    }
  }

  // Método para obtener el token de la cookie
  getToken(){
    if (typeof document !== 'undefined') {
      return getCookie('token')//Utilizamos la función getCookie para obtener el valor de la cookie 'token'
    }
    return null;
  }

  // Método para eliminar la cookie que contiene el token
  removeToken() {
    if (typeof document !== 'undefined') {
      removeCookie('token')// Utilizamos la función removeCookie para eliminar la cookie 'token'
    }
  }
}
