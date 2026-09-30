import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Marca {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  logo: string | null;
  activo: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio_compra: string;
  precio_venta: string;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  marca_id: number;
  categoria_id: number;
  destacado: boolean;
  activo: boolean;
  peso_gramos: string;
  ingredientes: string;
  created_at: string;
  updated_at: string;
  marca: Marca;
  categoria: Categoria;
}

@Injectable({
  providedIn: 'root'
})
export class Productos {
  private http = inject(HttpClient);
  private readonly API_PRODUCTOS = 'http://localhost:8000/api/productos';

  productos = signal<Producto[]>([]);

  constructor() {
    this.obtenerProductos().subscribe(data => this.productos.set(data));
  }

  obtenerPorId(id: number) {
    return this.productos().find(p => p.id === id);
  }

  obtenerProductos() {
    return this.http.get<Producto[]>(this.API_PRODUCTOS);
  }
}