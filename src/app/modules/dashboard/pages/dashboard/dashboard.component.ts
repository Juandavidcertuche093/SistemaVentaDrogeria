import { Component, inject, OnInit } from '@angular/core';

//Angular Material
import {MatCardModule} from '@angular/material/card';
// import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';

//Mostrar gráficos.
import { Chart, registerables } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';

import { DashboardService } from '../../services/dashboard.service';
// import { CommonModule } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  totalIngresos:string='0';
  totalVentas:string='0';
  totalProductos:string='0';
  totalUsuarios:string='0'

  constructor(
    private dashboardServicio: DashboardService
  ){}

  mostrarGrafico(labelGrafico:any[], dataGrafico:any[]){
    const chartBarras = new Chart('chartBarras',{ //chartBarras es el id para el camvas
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets:[{
          label:'Ventas',
          data:dataGrafico,
          backgroundColor: [
            'rgba(30, 64, 175, 0.8)', // #1e40af (blue-800) con 80% de opacidad
            'rgba(30, 64, 175, 0.8)', // #1e40af (blue-800) con 80% de opacidad
            'rgba(30, 64, 175, 0.8)', // #1e40af (blue-800) con 80% de opacidad
            'rgba(30, 64, 175, 0.8)', // #1e40af (blue-800) con 80% de opacidad
          ],
          borderColor: [
            'rgba(37, 99, 235, 1)',       // #2563eb (blue-800)
            'rgba(29, 78, 216, 1)',       // #1d4ed8 (blue-800)
            'rgba(37, 99, 235, 1)',        // #2563eb (blue-800)
            'rgba(30, 58, 138, 1)'        // #1e3a8a (blue-800)
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

  
  mostrarGraficoDona(labelGrafico: any[], dataGrafico: any[]) {
    const chartDona = new Chart('chartDona', {
      type: 'doughnut', // Cambiado de 'line' a 'doughnut'
      data: {
        labels: labelGrafico,
        datasets: [{
          label: 'Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(37, 99, 235, 0.8)',   // #2563eb (blue-700)
            'rgba(29, 78, 216, 0.8)',   // #1d4ed8 (blue-800)
            'rgba(30, 64, 175, 0.8)',   // #1e40af (blue-900)
            'rgba(30, 58, 138, 0.8)',   // #1e3a8a (blue-950)
            'rgba(23, 37, 84, 0.8)',    // #172554
            'rgba(30, 64, 175, 0.8)'    // #1e40af (extra color if needed)
          ],
          borderColor: [
            'rgba(37, 99, 235, 1)',     // #2563eb (blue-700)
            'rgba(29, 78, 216, 1)',     // #1d4ed8 (blue-800)
            'rgba(30, 64, 175, 1)',     // #1e40af (blue-900)
            'rgba(30, 58, 138, 1)',     // #1e3a8a (blue-950)
            'rgba(23, 37, 84, 1)',      // #172554
            'rgba(30, 64, 175, 1)'      // #1e40af (extra color if needed)
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        cutout: '50%',  // Esto crea el espacio en el centro para el gráfico de dona
        plugins: {
          legend: {
            position: 'left',  // Posición de la leyenda
          }
        }
      }
    });
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
          borderColor: 'rgba(30, 64, 175, 0.9)', // #1e40af (blue-800) con 80% de opacidad
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
          // this.totalIngresos = data.value.totalIngresos;
          this.totalIngresos = parseInt(data.value.totalIngresos).toLocaleString('es-CO');
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;
          this.totalUsuarios = data.value.totalUsuarios;
          
          const arrayData: any[] = data.value.ventasUltimaSemana
          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);

          this.mostrarGrafico(labelTemp,dataTemp); //Gráfico de barras
          this. mostrarGraficoDona(labelTemp, dataTemp)// grafico de dona
          this.mostrarGraficoLineas(labelTemp, dataTemp);  // Gráfico de líneas
          
        }
      },
      error:(e) => {}
    })
  }

}
