import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//angular/material
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { Medicamento } from '../../../../core/models/medicamento';
import { Venta } from '../../../../core/models/venta';
import { DetalleVenta } from '../../../../core/models/detalle-venta';

import {MedicamentoService} from '../../services/medicamento.service';
import {VentaService} from '../../services/venta.service';
import {UtilidadService} from '../../../../services/utilidad.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatDividerModule, CdkTableModule, MatTableModule, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss'
})
export class VentaComponent implements OnInit {

  //VARIABLES
  listaMedicamentos:Medicamento[]=[];//variable para almacenar los proudctos registrados
  listaMedicamentosFiltro:Medicamento[]=[]
  listaMedicamentosParaVenta: DetalleVenta[]=[]//va a contener la lista de productos que se van a vender
  bloquearBotonRegistrar: boolean = false
  medicamentoSelecionado!:Medicamento;
  tipoPagoDefecto: string = 'Efectivo';//por defecto va hacer en efectivo
  totalPAgar: number = 0;

  formularioMedicamentoVenta: FormGroup;
  columnasTabla: string[] = ["medicamento","cantidad","precio","total","accion"];
  datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta);

  //metodo para que nos sirve para buscar el medicamento por su nombre
  retornarMedicamentosPorFiltro(busqueda:any):Medicamento[]{
    const valorBuscado = typeof busqueda === 'string' ? busqueda.toLocaleLowerCase(): busqueda.nombre.toLocaleLowerCase();
    return this.listaMedicamentos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado))
  }

  constructor(
    private fb: FormBuilder,
    private medicamentoServicio: MedicamentoService,
    private ventaServicio: VentaService,
    private utilidadServicio: UtilidadService//// Para obtener el usuario de la sesión
  ){
    this.formularioMedicamentoVenta = this.fb.group({
      medicamento:["",[Validators.required]],
      cantidad:["",[Validators.required]]
    });

    //Traer lista de medicamentos activos y con stock > 0
    this.medicamentoServicio.lista()
    .subscribe({
      next:(data) => {
        if (data.status){
          const lista = data.value as Medicamento[];
          this.listaMedicamentos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error: (e) => {}
    })
    // Filtrar medicamentos por nombre en el formulario
    this.formularioMedicamentoVenta.get('medicamento')?.valueChanges
    .subscribe(value => {
      this.listaMedicamentosFiltro = this.retornarMedicamentosPorFiltro(value)
    })
  }
  
  ngOnInit(): void {
  }

  // Método para mostrar el nombre del medicamento seleccionado
  mostrarMedicamento(medicamento: Medicamento): string{
    return medicamento.nombre
  }

  // Asignar el medicamento seleccionado al objeto medicamentoSelecionado
  medicamentoParaVenta(event:any){
    this.medicamentoSelecionado = event.option.value;
  }

  agragarMediamentoParaVenta(){
    const _cantidad: number = this.formularioMedicamentoVenta.value.cantidad;
    const _precio: number = parseFloat(this.medicamentoSelecionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPAgar = this.totalPAgar + _total

    this.listaMedicamentosParaVenta.push({
      idMedicamento: this.medicamentoSelecionado.idMedicamento,
      descripcionMedicamento: this.medicamentoSelecionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio),
      totalTexto: String(_total)
    });
    this.datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta);

    // Resetear el formulario
    this.formularioMedicamentoVenta.patchValue({
      producto:"",
      cantidad:""
    })
  }

  // Eliminar un medicamento de la lista de venta
  eliminarMedicamento(detalle: DetalleVenta){
    this.totalPAgar = this.totalPAgar - parseFloat(detalle.totalTexto),
    this.listaMedicamentosParaVenta = this.listaMedicamentosParaVenta.filter(p => p.idMedicamento !== detalle.idMedicamento);

    this.datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta);
  }

  //Registrar la venta
  registrarVenta(){
    if (this.listaMedicamentosParaVenta .length > 0) {
      this.bloquearBotonRegistrar = true

      // Obtener información del usuario desde la sesión
      const usuarioSesion = this.utilidadServicio.obtenerSesionUsuario();
      const idUsuario = usuarioSesion ? usuarioSesion.idUsuario : '';
      const UsuarioDescripcion = usuarioSesion ? usuarioSesion.rolDescripcion : '';

      const request: Venta = {
        tipoPago: this.tipoPagoDefecto,
        totalTexto: String(this.totalPAgar.toFixed()),//toFixed() a un número, puedes especificar cuántos dígitos decimales deseas que aparezcan
        IdUsuario: idUsuario, // Incluimos el ID del usuario logueado
        usuarioDescripcion: UsuarioDescripcion, // Incluimos la descripción del usuario (rol)
        detalleventa: this.listaMedicamentosParaVenta 
      }

      this.ventaServicio.registrar(request)
      .subscribe({
        next: (response) => {
          if (response) {
            this.totalPAgar = 0.00;
            this.listaMedicamentosParaVenta =[],
            this.datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta );

            Swal.fire({
              icon:'success',
              title: "Venta Registrada",
              text: `Numero de venta ${response.value.numDocumento}`
            })
          } else
            this.utilidadServicio.mostrarAlerta('No se pudo registrar la venta','Oops');
        },
        complete:() => {
          this.bloquearBotonRegistrar = false;
        },
        error:(e) => {}
      })
    }
  }

}
