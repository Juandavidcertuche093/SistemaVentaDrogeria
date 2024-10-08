import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import {Login} from '../../../core/models/login';
import {Usuario} from '../../../core/models/usuario';
import { ResponseApi } from '../../../core/models/response-api';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi:string = environment.API_URL + "Usuario/";

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(resquest: Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,resquest)
  }

  editar(request: Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
