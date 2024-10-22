import { Component, computed, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';



import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Menu } from '../../../core/models/menu';
import { MenuService } from '../../services/menu.service';
import { UtilidadService } from '../../../services/utilidad.service';
import { TokenService } from '../../../services/token.service';
import {NotificacionesService} from '../../services/notificaciones.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule,  RouterOutlet, OverlayModule, MatListModule, RouterLink, RouterLinkActive, CommonModule, MatBadgeModule, MatMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  medicamentosStockBajo: any[] = [];

  //Una señal reactiva que registra si la barra lateral está contraída o no
  collapse = signal(true)

  sideNavCollapse = signal(false)

  //Propiedad calculada que devuelve el ancho de la barra lateral Si está contraída, el ancho es de '65 px'; de lo contrario, es de '250 px'. 
  sidenavWidth = computed(() => this.collapse() ? '65px' : '250px');

  listaMenus:Menu[] = [];
  correoUsuario:string='';
  rolUsuario:string='';

  constructor(
    private tokenService: TokenService,
    private menuServicio: MenuService,
    private utilidadServicio: UtilidadService,
    private notificacionesServicio: NotificacionesService,
    private router: Router
  ){}


  ngOnInit(): void {
    //obtener notificaciones del stock
    this.obtenerNotificacionesStock();
    // Obtener la sesión del usuario actual
    const usuario = this.utilidadServicio.obtenerSesionUsuario();
    // Si el usuario está presente
    if (usuario!= null) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
      // Llamar al servicio para obtener la lista de menús
      this.menuServicio.lista(usuario.idUsuario)
      .subscribe({
        next:(data) => {
          if(data)
            this.listaMenus = data.value
        },
        error:(e) => {}
      })
    }
  }

  obtenerNotificacionesStock() {
    this.notificacionesServicio.btenerMedicamentosConStockBajo().subscribe({
      next: (data) => {
        this.medicamentosStockBajo = data;
      },
      error: (err) => {
        console.error('Error obteniendo medicamentos con stock bajo', err);
      }
    });
  }

  logout() {
    this.tokenService.removeToken();  // Elimina el token
    localStorage.removeItem('usuario'); // Elimina la sesión del usuario (clave "usuario")
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }


  profilePicSize = computed(() => this.sideNavCollapse() ? '32' : '100');


}
