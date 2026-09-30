import { Injectable, signal, computed, effect } from '@angular/core';
import { Producto } from './productos';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

const CARRITO_STORAGE_KEY = 'carrito';

@Injectable({
  providedIn: 'root'
})
export class Carrito {
  private items = signal<ItemCarrito[]>(this.cargarDesdeStorage());

  itemsCarrito = this.items.asReadonly();

  cantidadTotal = computed(() =>
    this.items().reduce((total, item) => total + item.cantidad, 0)
  );

  totalPrecio = computed(() =>
    this.items().reduce((total, item) => total + Number(item.producto.precio_venta) * item.cantidad, 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(this.items()));
    });
  }

  private cargarDesdeStorage(): ItemCarrito[] {
    const guardado = localStorage.getItem(CARRITO_STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
  }

  agregarProducto(producto: Producto, cantidad: number = 1): void {
    this.items.update(items => {
      const existente = items.find(i => i.producto.id === producto.id);
      if (existente) {
        return items.map(i =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...items, { producto, cantidad }];
    });
  }

  modificarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(productoId);
      return;
    }
    this.items.update(items =>
      items.map(i => (i.producto.id === productoId ? { ...i, cantidad } : i))
    );
  }

  eliminarProducto(productoId: number): void {
    this.items.update(items => items.filter(i => i.producto.id !== productoId));
  }

  vaciarCarrito(): void {
    this.items.set([]);
  }
}