import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { roleGuard } from "../../core/guards/role.guard";
import { NotFoundComponent } from "../../shared/components/not-found/not-found.component";

export const layoutRoutes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.routes').then(m => m.dashboardRouter),
        canActivate: [authGuard, roleGuard], // Se requiere autenticación y rol específico
        data: { expectedRole: 'Administrador' } // Solo el Administrador puede acceder
    },
    {
        path: 'usuarios',
        loadChildren: () => import('../usuarios/usuario.routes').then(m => m.usuarioRouter),
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'medicamentos',
        loadChildren: () => import('../medicamentos/medicamento.routes').then(m => m.medicamentoRouter),
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'venta',
        loadChildren: () => import('../venta/venta.routes').then(m => m.ventaRouter),
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: ['Empleado', 'Administrador'] } // Tanto Vendedor como Administrador pueden acceder
    },
    {
        path: 'historialVenta',
        loadChildren: () => import('../historialVenta/historialVenta.routes').then(m => m.historialventaRouter),
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: ['Empleado', 'Administrador'] } // Tanto Vendedor como Administrador pueden acceder
    },
    {
        path: 'reportes',
        loadChildren: () => import('../reportes/reporte.routes').then(m => m.reporteRouter),
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: '401 No autorizado', // Ruta para la página 404
        component: NotFoundComponent
    },
    {
        path: '**', // Cualquier otra ruta no definida lleva a la página 404
        redirectTo: '401 No autorizado'
    }

]