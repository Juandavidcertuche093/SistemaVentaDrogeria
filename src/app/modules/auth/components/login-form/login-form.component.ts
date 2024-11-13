import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faPen, faEye, faEyeSlash, faUser, faUserCircle, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UtilidadService } from '../../../../services/utilidad.service';
import { Login } from '../../../../core/models/login';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  
  formularioLogin = this.formBuilder.nonNullable.group({
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required, Validators.minLength(5)]]
  });

  faPen = faPen;
  faEye = faEye;
  faUser = faUser
  faEyeSlash = faEyeSlash;
  faUserCircle = faUserCircle;
  faUserMd = faUserMd 
  showPassword = false;
  mostrarLoading:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuarioServicio: UsuarioService,
    private utilidadServicio: UtilidadService
  ){}

  iniciarSesion(){
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email ?? '',
      clave: this.formularioLogin.value.password ?? ''
    }
    this.usuarioServicio.iniciarSesion(request)
    .subscribe({
      next: (data) => {
        if (data.status) {
          const sesion = {
            idUsuario: data.value.idUsuario,
            correo: data.value.correo,
            rolDescripcion: data.value.rolDescripcion
          };
          this.utilidadServicio.guardarSesionUsuario(sesion)//solo se guarda la parate no sencible de los datos
          // Verificar el rol del usuario y redirigirlo
          if (sesion.rolDescripcion === 'Administrador') {
            this.router.navigate(['/dashboard']); // Redirige al dashboard si es Administrador
          } else if (sesion.rolDescripcion === 'Empleado') {
            this.router.navigate(['/venta']); // Redirige a venta si es Empleado
          } else {
            this.router.navigate(['/401']); // Si el rol no es válido, redirige a una página no autorizada
          }
        } else {
          this.utilidadServicio.mostrarAlerta("Nombre o contraseñas incorrectas. Por favor, verifique tus credenciales e intentelo nuevamente", "Opps")
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this.mostrarLoading = false;// Detener el loading en caso de error
        this.utilidadServicio.mostrarAlerta("Hubo un error con la conexión al servidor intentalo nuevamente mas tarde", "Opps");
      }
    });
  }
}
