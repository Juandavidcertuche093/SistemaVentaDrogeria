import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Asegúrate de importar esto

//angular/material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {Rol} from './../../../../core/models/rol';
import {Usuario} from './../../../../core/models/usuario';

import {RolService} from '../../service/rol.service';
import {UsuarioService} from '../../service/usuario.service';
import {UtilidadService} from '../../../../services/utilidad.service';

@Component({
  selector: 'app-modalregistro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule, MatAutocompleteModule],
  templateUrl: './modalregistro.component.html',
  styleUrl: './modalregistro.component.scss'
})
export class ModalregistroComponent implements OnInit {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = []//obtenemos las lista de los roles desde la base de datos

  constructor(
    private modalActual: MatDialogRef<ModalregistroComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private rolServicio: RolService,
    private usuarioServicio: UsuarioService,
    private UtilidadServicio: UtilidadService
  ){
    this.formularioUsuario = this.fb.nonNullable.group({
      nombreCompleto:['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      idRol:['', [Validators.required]],      
      clave:['', [Validators.minLength(5), Validators.required]],
      esActivo:['1', [Validators.required]],

    });
    if (this.datosUsuario !== null && this.datosUsuario !== undefined) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }

    //traemos la lista de los roles
    this.rolServicio.list()
    .subscribe({
      next: (data) => {
       if(data.status) this.listaRoles = data.value
      },
      error:(e)=>{}
    })
  }

  //si hay un usuario en datosUsuario (modo edición), se cargan los valores actuales del usuario
  ngOnInit(): void {
    if (this.datosUsuario !== null && this.datosUsuario !== undefined)
      this.formularioUsuario.patchValue({
        nombreCompleto:this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol:this.datosUsuario.idRol,      
        clave:this.datosUsuario.clave,
        esActivo:this.datosUsuario.esActivo,
      })
  }

  guardarEditar_Usuario(){
    //logica para crear y a su ves actualiar un usuario
    const _usurio: Usuario = {
      idUsuario: this.datosUsuario == null ? 0: this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: "",
      // clave: this.formularioUsuario.value.clave,
      clave: this.formularioUsuario.value.clave ? this.formularioUsuario.value.clave : this.datosUsuario?.clave,  // Usar clave actual si no hay nueva  
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }
   
    // Verifica en la consola qué datos se están enviando
    console.log('Datos del usuario a enviar:', _usurio);

    if(this.datosUsuario == null){
       //logica para craar el usuario
       this.usuarioServicio.guardar(_usurio)
       .subscribe({
         next: (data) => {
           if (data.status) {
             this.UtilidadServicio.mostrarAlerta("El usuario fue registrado","Exito");
             this.modalActual.close("true")
           } else
             this.UtilidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error")
         },
         error:(e) => {}
       })
    } else {
       //logica para editar un usuario
       this.usuarioServicio.editar(_usurio)
       .subscribe({
         next: (data) => {
           if (data.status) {
             this.UtilidadServicio.mostrarAlerta("El usuario fue actualizado","Exito");
             this.modalActual.close("true")
           } else
             this.UtilidadServicio.mostrarAlerta("No se pudo actualizar el usuario","Error")
         },
         error:(e) => {}
       })
    }
  }
}
