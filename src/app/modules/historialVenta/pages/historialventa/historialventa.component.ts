import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

import { ModalDetalleVentaComponent } from '../../components/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from '../../../../core/models/venta';
import {VentaService} from '../../services/venta.service';
import {UtilidadService} from '../../../../services/utilidad.service';

export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historialventa',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, CdkTableModule, CommonModule, MatCardModule, MatIconModule, MatButtonModule, DialogModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './historialventa.component.html',
  styleUrl: './historialventa.component.scss',
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialventaComponent implements OnInit, AfterViewInit {

  formualrioBuscqueda: FormGroup;
  opcionesBuscqueda:any[]= [
    {value: 'fecha', descripcion: 'Por fecha'},
    {value: 'numero', descripcion: 'Nuemero Venta'}
  ]
  columnasTabla:String[]=['fechaRegistro','numeroDocumento','tipoPago','total','accion']
  dataInicio: Venta[]=[]
  dataListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private ventaServicio: VentaService,
    private utilidadService: UtilidadService
  ){
    this.formualrioBuscqueda = this.fb.group({//cada ves que cambia se van a ocultar algunaos campos ya sea por fecha o por numero
      buscarPor:['fecha'],//valor por defecto
      numero:[''],
      fechaInicio:[''],
      fechaFin:['']
    })

    //logica para cada ves que cambie la busqueda por fecha o numero este vacio
    this.formualrioBuscqueda.get('buscarPor')?.valueChanges
    .subscribe(value => {
      this.formualrioBuscqueda.patchValue({
        numero:'',
        fechaInicio:'',
        fechaFin:''
      })
    })
  }


  ngOnInit(): void {
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataListaVenta.paginator = this.paginacionTabla
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaVenta.filter = filterValue.trim().toLocaleLowerCase();
  }

  //metodo para realizar una busqueda por fecha
  buscarVentas(){
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    if (this.formualrioBuscqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formualrioBuscqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formualrioBuscqueda.value.fechaFin).format('DD/MM/YYYY');

      if(_fechaInicio === 'invalid date' || _fechaFin === 'invalid date'){
        this.utilidadService.mostrarAlerta('Debe de ingresar ambas fechas','Oops!')
        return;
      }
    }

    this.ventaServicio.historial(
      this.formualrioBuscqueda.value.buscarPor,
      this.formualrioBuscqueda.value.numero,
      _fechaInicio,
      _fechaFin
    )
    .subscribe({
      next:(data) => {
        if (data.status) 
          this.dataListaVenta.data = data.value;
        else
          this.utilidadService.mostrarAlerta('No se encontraron datos','Oops!')
      },
      error:(e)=>{}
    })
  }

  //metodo para visualizar el detalle de una venta con el modal
  verDetalleVenta(_venta:Venta){
    this.dialog.open(ModalDetalleVentaComponent,{
      data:_venta,
      disableClose:true,
      width:'700px'
    })
  }
}
