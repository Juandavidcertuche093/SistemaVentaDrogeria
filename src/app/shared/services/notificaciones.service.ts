import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ResponseApi } from '../../core/models/response-api';


@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private urlApi:string = environment.API_URL + "Medicamento/";

  private http = inject(HttpClient)

  constructor() { }

  // Llama al backend para obtener medicamentos con stock bajo
  btenerMedicamentosConStockBajo(stockMinimo: number = 10): Observable<ResponseApi[]> {
    return this.http.get<ResponseApi[]>(`${this.urlApi}MedicamentosStockBajo`, {
      params: { stockMinimo: stockMinimo }
    });
  }
}
