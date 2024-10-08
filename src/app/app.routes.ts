import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/components/layout/layout.component';

export const routes: Routes = [
    // {
    //     path:'',//ruta principal
    //     loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
    // },
    {
        path:'',
        component:LayoutComponent,
        loadChildren: () => import ('./modules/layout/layout.routes').then((m) => m.layoutRoutes)
    }
];
