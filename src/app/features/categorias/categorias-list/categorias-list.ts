import { Component, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CategoriaForm } from '../categoria-form/categoria-form';
import { Categorias, Categoria } from '../../../shared/services/categorias';

const CATEGORIA_VACIA: Categoria = { id: 0, nombre: '', slug: '', descripcion: '' };

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [Table, Button, CategoriaForm],
  templateUrl: './categorias-list.html'
})
export class CategoriasList {
  private categoriasService = inject(Categorias);
  private messageService = inject(MessageService);

  categorias = signal<Categoria[]>([]);

  dialogVisible = signal(false);
  categoriaSeleccionada = signal<Categoria>(CATEGORIA_VACIA);

  ngOnInit(): void {
    this.categoriasService.obtenerCategorias().subscribe({
      next: data => this.categorias.set(data),
      error: () => this.mostrarErrorConexion(),
    });
  }

  abrirNueva(): void {
    this.categoriaSeleccionada.set({ ...CATEGORIA_VACIA });
    this.dialogVisible.set(true);
  }

  abrirEditar(categoria: Categoria): void {
    this.categoriaSeleccionada.set({ ...categoria });
    this.dialogVisible.set(true);
  }

  guardar(categoria: Categoria): void {
    if (categoria.id === 0) {
      this.categoriasService.crear(categoria).subscribe({
        next: nueva => {
          this.categorias.update(lista => [...lista, nueva]);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Categoría creada', detail: `"${nueva.nombre}" se guardó correctamente.` });
        },
        error: err => this.mostrarErrorGuardado(err),
      });
    } else {
      this.categoriasService.actualizar(categoria.id, categoria).subscribe({
        next: actualizada => {
          this.categorias.update(lista =>
            lista.map(c => (c.id === categoria.id ? actualizada : c))
          );
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Categoría actualizada', detail: `"${actualizada.nombre}" se actualizó correctamente.` });
        },
        error: err => this.mostrarErrorGuardado(err),
      });
    }
  }

  eliminar(categoria: Categoria): void {
    this.categoriasService.eliminar(categoria.id).subscribe({
      next: () => {
        this.categorias.update(lista => lista.filter(c => c.id !== categoria.id));
        this.messageService.add({ severity: 'success', summary: 'Categoría eliminada', detail: `"${categoria.nombre}" se eliminó correctamente.` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error al eliminar', detail: 'No se pudo eliminar la categoría. Intentá de nuevo.' });
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