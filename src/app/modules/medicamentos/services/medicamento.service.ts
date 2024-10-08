import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ResponseApi } from '../../../core/models/response-api';
import {Medicamento} from '../../../core/models/medicamento'

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private urlApi:string = environment.API_URL + "Medicamento/";

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(resquest: Medicamento):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,resquest)
  }

  editar(request: Medicamento):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }

}
