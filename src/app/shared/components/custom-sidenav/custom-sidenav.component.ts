import { Component, computed, inject, Input, signal } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import {MenuItem} from '../../../core/models/menu-items';

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatListModule, MatIconModule, CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {
  
  sideNavCollapse = signal(false)

  @Input() set collapsed(val: boolean){
    this.sideNavCollapse.set(val)
  }

  constructor(){}

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Panel',
      route: 'dashboard',      
    },
    {
      icon: 'group',
      label: 'usuarios',
      route: 'usuarios',
      
    },
    {
      icon: 'medical_services',
      label: 'medicamentos',
      route: 'medicamentos',
      
    },
    {
      icon: 'currency_exchange',
      label: 'Venta',
      route: 'venta',
      
    },
    {
      icon: 'edit_note',
      label: 'HistorialVenta',
      route: 'historialVenta',
      
    },
    {
      icon: 'receipt',
      label: 'Reportes',
      route: 'reportes',
      
    },
  ])

  profilePicSize = computed(() => this.sideNavCollapse() ? '32' : '100');

}
