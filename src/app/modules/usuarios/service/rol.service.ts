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
export class RolService {

  private urlApi:string = environment.API_URL + "Rol/";

  private http = inject(HttpClient)

  constructor() { }

  list():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
}
