import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

export const redirectGuard: CanActivateFn = () => {
  const token = inject(TokenService).getToken();
  const router = inject(Router);
  if (token){
    router.navigate(['/dashboard'])//redirige l usuario al dashvoar si ya esta aurenticado
    return false;//Bloque la navegacion a rutas publicas como el login
  }
  return true;//si hay un token permite la navegacion
};
//Este guard verifica si el usuario tiene un token de autenticación. Si tiene un token (lo que implica que está autenticado), redirige al usuario a la página del dashboard. Sin embargo, incluso si el usuario tiene un token, el guard retorna true, permitiendo la navegación a la ruta solicitada.
