import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Sidebar01Component} from '../../../../shared/components/sidebar01/sidebar01.component'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Sidebar01Component, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
