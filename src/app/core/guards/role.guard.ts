import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';//ActivatedRouteSnapshot Se usa para acceder a la información de la ruta, como los datos adicionales (data) que definen qué roles son permitidos.
import { inject } from '@angular/core';
import { UtilidadService } from '../../services/utilidad.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const utilidadService = inject(UtilidadService);
  const router = inject(Router);
  const usuarioSesion = utilidadService.obtenerSesionUsuario();
  //verificamos si hay una sesion de usuario guardad en el local storage
  if (!usuarioSesion) {
    router.navigate(['/login'])
    return false;
  }
  //obtenemos los roles permitidos desde la propiedad 'data.expectedRole'
  const rolesPermitidos = route.data['expectedRole'];
  //Si `expectedRole` es un string (un solo rol), lo convertimos a array
  const rolesPermitidosArray = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];
  // Verificamos si el rol del usuario está en la lista de roles permitidos
  if (rolesPermitidosArray.includes(usuarioSesion.rolDescripcion)) {
    return true;
  } else {
    router.navigate(['/401']); // Redirige a una página de error o de acceso denegado
    return false;
  }
};

//Este roleGuard garantiza que solo los usuarios con roles específicos puedan acceder a ciertas rutas en la aplicación, reforzando la seguridad en el control de acceso basado en roles.