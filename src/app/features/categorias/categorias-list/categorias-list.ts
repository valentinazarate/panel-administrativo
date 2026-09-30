import { Component, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { CategoriaForm, Categoria } from '../categoria-form/categoria-form';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [Table, Button, CategoriaForm],
  templateUrl: './categorias-list.html'
})
export class CategoriasList {
  categorias = signal<Categoria[]>([
    { id: 1, nombre: 'Harinas', descripcion: 'Harinas sin gluten: arroz, avena, almendra, garbanzo' },
    { id: 2, nombre: 'Semillas', descripcion: 'Semillas y derivados' },
    { id: 3, nombre: 'Recetas', descripcion: 'Preparaciones a base de harinas sin gluten' },
  ]);

  dialogVisible = signal(false);
  categoriaSeleccionada = signal<Categoria>({ id: 0, nombre: '', descripcion: '' });

  abrirNueva(): void {
    this.categoriaSeleccionada.set({ id: 0, nombre: '', descripcion: '' });
    this.dialogVisible.set(true);
  }

  abrirEditar(categoria: Categoria): void {
    this.categoriaSeleccionada.set({ ...categoria });
    this.dialogVisible.set(true);
  }

  guardar(categoria: Categoria): void {
    if (categoria.id === 0) {
      const nuevoId = Math.max(0, ...this.categorias().map(c => c.id)) + 1;
      this.categorias.update(lista => [...lista, { ...categoria, id: nuevoId }]);
    } else {
      this.categorias.update(lista =>
        lista.map(c => (c.id === categoria.id ? categoria : c))
      );
    }
    this.dialogVisible.set(false);
  }

  eliminar(categoria: Categoria): void {
    this.categorias.update(lista => lista.filter(c => c.id !== categoria.id));
  }
}