import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import {environment} from '../../../../environments/environments';
import {Login} from '../../../core/models/login';
import {ResponseApi} from '../../../core/models/response-api';
import { TokenService } from '../../../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi:string = environment.API_URL + "Usuario/";
  private http = inject(HttpClient)
  private tokenService = inject(TokenService)

  constructor() { }

  iniciarSesion(request: Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}IniciarSesion`, request)
    .pipe(
      tap(response => {
        if (response && response.value && response.value.token) {
          this.tokenService.saveToken(response.value.token)
        }
      })
    )
  }

  cerrarSesion(){
    this.tokenService.removeToken();
    localStorage.removeItem('usuario')
  }
}
