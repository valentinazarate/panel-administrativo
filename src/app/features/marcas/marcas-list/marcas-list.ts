import { Component, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
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
  private messageService = inject(MessageService);

  marcas = signal<Marca[]>([]);

  dialogVisible = signal(false);
  marcaSeleccionada = signal<Marca>(MARCA_VACIA);

  ngOnInit(): void {
    this.marcasService.obtenerMarcas().subscribe({
      next: data => this.marcas.set(data),
      error: () => this.mostrarErrorConexion(),
    });
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
      this.marcasService.crear(marca).subscribe({
        next: nueva => {
          this.marcas.update(lista => [...lista, nueva]);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Marca creada', detail: `"${nueva.nombre}" se guardó correctamente.` });
        },
        error: err => this.mostrarErrorGuardado(err),
      });
    } else {
      this.marcasService.actualizar(marca.id, marca).subscribe({
        next: actualizada => {
          this.marcas.update(lista =>
            lista.map(m => (m.id === marca.id ? actualizada : m))
          );
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Marca actualizada', detail: `"${actualizada.nombre}" se actualizó correctamente.` });
        },
        error: err => this.mostrarErrorGuardado(err),
      });
    }
  }

  eliminar(marca: Marca): void {
    this.marcasService.eliminar(marca.id).subscribe({
      next: () => {
        this.marcas.update(lista => lista.filter(m => m.id !== marca.id));
        this.messageService.add({ severity: 'success', summary: 'Marca eliminada', detail: `"${marca.nombre}" se eliminó correctamente.` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error al eliminar', detail: 'No se pudo eliminar la marca. Intentá de nuevo.' });
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