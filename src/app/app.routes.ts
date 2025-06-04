import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () =>
            import('./home-page/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: 'customer',
        loadComponent: () =>
            import('./customer-page/customer-page.component').then(m => m.CustomerComponent)
    },
    {
        path: 'order',
        loadComponent: () =>
            import('./order-page/order-page.component').then(m => m.OrderComponent)
    }

];
