import { Component, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { MarcaForm, Marca } from '../marca-form/marca-form';

@Component({
  selector: 'app-marcas-list',
  standalone: true,
  imports: [Table, Button, MarcaForm],
  templateUrl: './marcas-list.html'
})
export class MarcasList {
  marcas = signal<Marca[]>([
    { id: 1, nombre: 'Sin Gluten & Punto', descripcion: 'Marca propia de la tienda' },
    { id: 2, nombre: 'NaturFit', descripcion: 'Productos orgánicos importados' },
  ]);

  dialogVisible = signal(false);
  marcaSeleccionada = signal<Marca>({ id: 0, nombre: '', descripcion: '' });

  abrirNueva(): void {
    this.marcaSeleccionada.set({ id: 0, nombre: '', descripcion: '' });
    this.dialogVisible.set(true);
  }

  abrirEditar(marca: Marca): void {
    this.marcaSeleccionada.set({ ...marca });
    this.dialogVisible.set(true);
  }

  guardar(marca: Marca): void {
    if (marca.id === 0) {
      const nuevoId = Math.max(0, ...this.marcas().map(m => m.id)) + 1;
      this.marcas.update(lista => [...lista, { ...marca, id: nuevoId }]);
    } else {
      this.marcas.update(lista =>
        lista.map(m => (m.id === marca.id ? marca : m))
      );
    }
    this.dialogVisible.set(false);
  }

  eliminar(marca: Marca): void {
    this.marcas.update(lista => lista.filter(m => m.id !== marca.id));
  }
}