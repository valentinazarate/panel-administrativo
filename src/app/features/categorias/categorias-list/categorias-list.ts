import { Component, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
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

  categorias = signal<Categoria[]>([]);

  dialogVisible = signal(false);
  categoriaSeleccionada = signal<Categoria>(CATEGORIA_VACIA);

  ngOnInit(): void {
    this.categoriasService.obtenerCategorias().subscribe(data => this.categorias.set(data));
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
      this.categoriasService.crear(categoria).subscribe(nueva => {
        this.categorias.update(lista => [...lista, nueva]);
      });
    } else {
      this.categoriasService.actualizar(categoria.id, categoria).subscribe(actualizada => {
        this.categorias.update(lista =>
          lista.map(c => (c.id === categoria.id ? actualizada : c))
        );
      });
    }
    this.dialogVisible.set(false);
  }

  eliminar(categoria: Categoria): void {
    this.categoriasService.eliminar(categoria.id).subscribe(() => {
      this.categorias.update(lista => lista.filter(c => c.id !== categoria.id));
    });
  }
}