import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/components/layout/layout.component';
import {authGuard} from './core/guards/auth.guard';
import {redirectGuard} from './core/guards/redirect.guard';

export const routes: Routes = [
    {
        path:'',//ruta principal
        canActivate: [redirectGuard],
        loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
    },
    {
        path:'',
        canActivate: [authGuard],
        component:LayoutComponent,
        loadChildren: () => import ('./modules/layout/layout.routes').then((m) => m.layoutRoutes)
    }
];
