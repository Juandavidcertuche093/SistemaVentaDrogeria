import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

import moment from 'moment';
import * as XLSX from 'xlsx';

import { Reporte } from '../../../../core/models/reporte';
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
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatDividerModule, CdkTableModule, MatTableModule, ReactiveFormsModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {

  formularioFiltro:FormGroup
  listaVentasReporte:Reporte[]=[];
  columnasTabla: string[] = ['fechaRegistro','numeroVenta','tipoPago','total','producto','cantidad','precio','totalProducto', 'usuario'];
  dataVentaReporte= new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator

  constructor(
    private fb: FormBuilder,
    private ventaServicio: VentaService,
    private utilidadService: UtilidadService
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio:['',[Validators.required]],
      fechaFin:['',[Validators.required]]
    })
  }


  ngOnInit(): void {
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla
  }

  //metodo para buscar por rango de fecha
  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
      this.utilidadService.mostrarAlerta('Debe de ingresar ambas fechas','Oops!')
      return;
    }

    this.ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    )
    .subscribe({
      next:(data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = []
          this.utilidadService.mostrarAlerta('No se encontraron datos','Oops!')
        }
      },
      error:(e)=>{}
    })
  }

  //metodo para exportar al excel
  exportarExcel(){
    const wb = XLSX.utils.book_new(); //nuevo libro
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

    XLSX.utils.book_append_sheet(wb,ws,"Reporte");
    XLSX.writeFile(wb,"Reporte Ventas.xlsx")
  }

}
