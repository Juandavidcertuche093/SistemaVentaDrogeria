import { Component, inject, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
//Angular Material
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

//Mostrar gráficos.
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatIconModule, BaseChartDirective, CommonModule, MatMenuModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  totalIngresos:string='0';
  totalVentas:string='0';
  totalProductos:string='0'

  constructor(
    private dashboardServicio: DashboardService
  ){}

  mostrarGrafico(labelGrafico:any[], dataGrafico:any[]){
    const chartBarras = new Chart('chartBarras',{ //chartBarras es el id para el camvas
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets:[{
          label:'# de Ventas',
          data:dataGrafico,
          backgroundColor:[
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)', 
            'rgba(255, 159, 64, 0.2)', 
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor:[
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)', 
            'rgba(255, 159, 64, 1)', 
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })
  }

  mostrarGraficoLineas(labelGrafico: any[], dataGrafico: any[]) {
    const chartLineas = new Chart('chartLineas', {
      type: 'line',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: 'Ventas',
          data: dataGrafico,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  ngOnInit(): void {
    this.dashboardServicio.resumen()
    .subscribe({
      next:(data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;
          
          const arrayData: any[] = data.value.ventasUltimaSemana
          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);

          this.mostrarGrafico(labelTemp,dataTemp); //Gráfico de barras
          this.mostrarGraficoLineas(labelTemp, dataTemp);  // Gráfico de líneas
        }
      },
      error:(e) => {}
    })
  }

}
