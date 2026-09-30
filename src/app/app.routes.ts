import { Routes } from '@angular/router';
import { AdminLayout } from './core/layout/admin-layout/admin-layout';
import { StoreLayout } from './core/layout/store-layout/store-layout';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayout,
    children: [
      { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
      { path: 'catalogo', loadComponent: () => import('./features/catalogo/catalogo-list/catalogo-list').then(m => m.CatalogoList) },
      { path: 'producto/:id', loadComponent: () => import('./features/catalogo/producto-detalle/producto-detalle').then(m => m.ProductoDetalle) },
      { path: 'carrito', loadComponent: () => import('./features/carrito/carrito/carrito').then(m => m.Carrito) },
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'categorias', loadComponent: () => import('./features/categorias/categorias-list/categorias-list').then(m => m.CategoriasList) },
      { path: 'marcas', loadComponent: () => import('./features/marcas/marcas-list/marcas-list').then(m => m.MarcasList) },
      { path: 'productos', loadComponent: () => import('./features/productos/productos-list/productos-list').then(m => m.ProductosList) },
    ]
  }
];