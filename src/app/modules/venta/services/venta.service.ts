import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import {Venta} from '../../../core/models/venta';
import { ResponseApi } from '../../../core/models/response-api';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi:string = environment.API_URL + "Venta/";

  private http = inject(HttpClient)

  constructor() { }

  registrar(resquest: Venta):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`,resquest)
  }
}
