import { Component, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { MarcaForm } from '../marca-form/marca-form';
import { Marcas, Marca } from '../../../shared/services/marcas';

const MARCA_VACIA: Marca = { id: 0, nombre: '', slug: '', descripcion: '', logo: null, activo: true };

@Component({
  selector: 'app-marcas-list',
  standalone: true,
  imports: [Table, Button, MarcaForm],
  templateUrl: './marcas-list.html'
})
export class MarcasList {
  private marcasService = inject(Marcas);

  marcas = signal<Marca[]>([]);

  dialogVisible = signal(false);
  marcaSeleccionada = signal<Marca>(MARCA_VACIA);

  ngOnInit(): void {
    this.marcasService.obtenerMarcas().subscribe(data => this.marcas.set(data));
  }

  abrirNueva(): void {
    this.marcaSeleccionada.set({ ...MARCA_VACIA });
    this.dialogVisible.set(true);
  }

  abrirEditar(marca: Marca): void {
    this.marcaSeleccionada.set({ ...marca });
    this.dialogVisible.set(true);
  }

  guardar(marca: Marca): void {
    if (marca.id === 0) {
      this.marcasService.crear(marca).subscribe(nueva => {
        this.marcas.update(lista => [...lista, nueva]);
      });
    } else {
      this.marcasService.actualizar(marca.id, marca).subscribe(actualizada => {
        this.marcas.update(lista =>
          lista.map(m => (m.id === marca.id ? actualizada : m))
        );
      });
    }
    this.dialogVisible.set(false);
  }

  eliminar(marca: Marca): void {
    this.marcasService.eliminar(marca.id).subscribe(() => {
      this.marcas.update(lista => lista.filter(m => m.id !== marca.id));
    });
  }
}