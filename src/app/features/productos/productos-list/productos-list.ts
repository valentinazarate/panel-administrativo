import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
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
  private messageService = inject(MessageService);

  protected productos = signal<Producto[]>([]);

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosService.obtenerProductos().subscribe({
      next: data => this.productos.set(data),
      error: () => this.mostrarErrorConexion(),
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
      this.productosService.crear(producto).subscribe({
        next: respuesta => {
          this.productos.update(lista => [...lista, respuesta.data]);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Producto creado', detail: `"${respuesta.data.nombre}" se guardó correctamente.` });
        },
        error: err => this.mostrarErrorGuardado(err),
      });
    } else {
      this.productosService.actualizar(producto.id, producto).subscribe({
        next: actualizado => {
          this.productos.update(lista =>
            lista.map(p => (p.id === producto.id ? actualizado : p))
          );
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Producto actualizado', detail: `"${actualizado.nombre}" se actualizó correctamente.` });
        },
        error: err => this.mostrarErrorGuardado(err),
      });
    }
  }

  eliminar(producto: Producto): void {
    this.productosService.eliminar(producto.id).subscribe({
      next: () => {
        this.productos.update(lista => lista.filter(p => p.id !== producto.id));
        this.messageService.add({ severity: 'success', summary: 'Producto eliminado', detail: `"${producto.nombre}" se eliminó correctamente.` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error al eliminar', detail: 'No se pudo eliminar el producto. Intentá de nuevo.' });
      },
    });
  }

  private mostrarErrorGuardado(err: any): void {
    const detalle = err?.error?.message ?? 'Revisá los datos ingresados e intentá de nuevo.';
    this.messageService.add({ severity: 'error', summary: 'Error al guardar', detail: detalle });
  }

  private mostrarErrorConexion(): void {
    this.messageService.add({ severity: 'error', summary: 'Sin conexión', detail: 'No se pudo conectar con el servidor.' });
  }
}