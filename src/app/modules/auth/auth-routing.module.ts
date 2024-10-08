import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  //cuano el usuario acceda a la raiz de la aplicacion, sera redirigido a la ruta 'login'
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  //cuando la URL coincida con el login el compoenete loginComponent se renderizara en el area de la vista correspondiente 
  {
    path:'login',
    component: LoginComponent,
    title:'Sistema de ventas'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
