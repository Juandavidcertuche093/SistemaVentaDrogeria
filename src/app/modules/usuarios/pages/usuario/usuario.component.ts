import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

//angular material
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DialogModule} from '@angular/cdk/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';

import {ModalregistroComponent} from '../../components/modalregistro/modalregistro.component';
import { Usuario } from '../../../../core/models/usuario';
import { UsuarioService } from '../../service/usuario.service';
import { UtilidadService } from '../../../../services/utilidad.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MatTableModule, CdkTableModule, CommonModule, MatCardModule, MatIconModule, MatButtonModule, DialogModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatPaginatorModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescription', 'estado', 'acciones'];
  dataInicio:Usuario[]=[]
  dataListaUsuario = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private usuarioServicio: UsuarioService,
    private utiliadServicio: UtilidadService
  ){}

  obtenerUsuarios(){
    this.usuarioServicio.lista()
    .subscribe({
      next: (data) => {
       if(data.status)
         this.dataListaUsuario.data = data.value;
        else
        this.utiliadServicio.mostrarAlerta("No se encontraron datos","Ooops!")
      },
      error:(e)=>{}
    })
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator = this.paginacionTabla
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter = filterValue.trim().toLocaleLowerCase();
  }

  //metodo para el modal de crear usuario
  nuevoUsuario(){
    this.dialog.open(ModalregistroComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true')this.obtenerUsuarios();
    });
  }

  //metodo para el modal de actualizar usuario
  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalregistroComponent,{
      disableClose:true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true')this.obtenerUsuarios();
    });
  }

  //metodo para elimainar un usuario
  eliminarUsuario(usuario:Usuario){
    //libreria de alertas personalizadas
    Swal.fire({
      title:'¿Desea eliminar el usuario',
      text: usuario.nombreCompleto,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this.usuarioServicio.eliminar(usuario.idUsuario)
        .subscribe({
          next:(data) => {
            if(data.status){
              this.utiliadServicio.mostrarAlerta("El usuario fue eliminado","Listo!");
              this.obtenerUsuarios();
            }else
            this.utiliadServicio.mostrarAlerta("No se pudo eliminar el usuario","Error");
          },
          error:(e) => {}
        })
      }
    })
  }
}
