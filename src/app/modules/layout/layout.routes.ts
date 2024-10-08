import { Routes } from "@angular/router";
import { NotFoundComponent } from "../../shared/components/not-found/not-found.component";

export const layoutRoutes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.routes').then(m => m.dashboardRouter),
    },
    {
        path: 'usuarios',
        loadChildren: () => import('../usuarios/usuario.routes').then(m => m.usuarioRouter),
    },
    {
        path: 'medicamentos',
        loadChildren: () => import('../medicamentos/medicamento.routes').then(m => m.medicamentoRouter),
    },
    {
        path: 'venta',
        loadChildren: () => import('../venta/venta.routes').then(m => m.ventaRouter),
    },
    {
        path: 'historialVenta',
        loadChildren: () => import('../historialVenta/historialVenta.routes').then(m => m.historialventaRouter),
    },
    {
        path: 'reportes',
        loadChildren: () => import('../reportes/reporte.routes').then(m => m.reporteRouter),
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