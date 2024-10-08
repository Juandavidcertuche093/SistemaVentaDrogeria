import { Component } from '@angular/core';
import {RouterLinkWithHref} from '@angular/router' // esto nos sirve para que cuando nos devolvamos del a pagina 404 no vuelva a recargar la pagina
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLinkWithHref, CommonModule, MatCardModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
