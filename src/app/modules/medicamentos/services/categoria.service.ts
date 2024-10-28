import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ResponseApi } from '../../../core/models/response-api';
import {Categoria} from '../../../core/models/categoria'

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlApi:string = environment.API_URL + "Categoria/";

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(request: Categoria):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,request)
  }
}
