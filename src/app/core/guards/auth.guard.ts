import { CanActivateFn, Router } from '@angular/router';
import {TokenService} from '../../services/token.service';
import { inject } from '@angular/core'


export const authGuard: CanActivateFn = () => {
  const token = inject(TokenService).getToken();
  const router = inject(Router);
  if (!token){
    router.navigate(['/login']);//los redirige al login si no hay un token
    return false;//Bloquea el acceso a la ruta
  }
  return true;//permite la navegacion si hay token
};
//se encarga de verificar si hay un token de autenticación. Si no lo hay, redirige al usuario a la página de inicio de sesión.
