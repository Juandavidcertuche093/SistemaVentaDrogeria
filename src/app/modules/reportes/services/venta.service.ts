import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ResponseApi } from '../../../core/models/response-api';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi:string = environment.API_URL + "Venta/";

  private http = inject(HttpClient)

  constructor() { }

  reporte(fechaInicio:string,fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    )
  }
}
