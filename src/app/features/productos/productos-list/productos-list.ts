import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { ProductoForm } from '../producto-form/producto-form';
import { Productos, Producto } from '../../../shared/services/productos';

const PRODUCTO_VACIO: Producto = {
  id: 0,
  nombre: '',
  slug: '',
  descripcion_corta: '',
  descripcion_larga: '',
  precio_compra: '0',
  precio_venta: '0',
  stock: 0,
  stock_minimo: 0,
  unidad_medida: '',
  marca_id: 0,
  categoria_id: 0,
  destacado: false,
  activo: true,
  peso_gramos: '0',
  ingredientes: '',
  created_at: '',
  updated_at: '',
  marca: { id: 0, nombre: '', slug: '', descripcion: null, logo: null, activo: true },
  categoria: { id: 0, nombre: '', slug: '' },
};

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [Table, Button, CurrencyPipe, ProductoForm],
  templateUrl: './productos-list.html'
})
export class ProductosList {

  private productosService = inject(Productos);

  protected productos = signal<Producto[]>([]);

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosService.obtenerProductos().subscribe(data => {
      this.productos.set(data);
      console.log('Productos cargados:', data);
    });
  }

  dialogVisible = signal(false);
  productoSeleccionado = signal<Producto>(PRODUCTO_VACIO);

  abrirNuevo(): void {
    this.productoSeleccionado.set({ ...PRODUCTO_VACIO });
    this.dialogVisible.set(true);
  }

  abrirEditar(producto: Producto): void {
    this.productoSeleccionado.set({ ...producto });
    this.dialogVisible.set(true);
  }

   guardar(producto: Producto): void {
  if (producto.id === 0) {
    this.productosService.crear(producto).subscribe(respuesta => {
      this.productos.update(lista => [...lista, respuesta.data]);
    });
  } else {
    this.productosService.actualizar(producto.id, producto).subscribe(actualizado => {
      this.productos.update(lista =>
        lista.map(p => (p.id === producto.id ? actualizado : p))
      );
    });
  }
  this.dialogVisible.set(false);
}

   eliminar(producto: Producto): void {
    this.productosService.eliminar(producto.id).subscribe(() => {
      this.productos.update(lista => lista.filter(p => p.id !== producto.id));
    });
  }
} 