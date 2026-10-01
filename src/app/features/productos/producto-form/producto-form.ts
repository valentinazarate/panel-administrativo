import { Component, input, output, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Producto } from '../../../shared/services/productos';
import { Marcas, Marca } from '../../../shared/services/marcas';
import { Categorias, Categoria } from '../../../shared/services/categorias';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, Dialog, InputText, InputNumber, Textarea, Button, Select],
  templateUrl: './producto-form.html'
})
export class ProductoForm {
  visible = input.required<boolean>();
  producto = input.required<Producto>();

  visibleChange = output<boolean>();
  guardar = output<Producto>();

  private fb = new FormBuilder();
  private marcasService = inject(Marcas);
  private categoriasService = inject(Categorias);

  marcas = signal<Marca[]>([]);
  categorias = signal<Categoria[]>([]);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    marca_id: [0, [Validators.required, Validators.min(1)]],
    categoria_id: [0, [Validators.required, Validators.min(1)]],
    unidad_medida: ['', Validators.required],
  });

  constructor() {
    this.marcasService.obtenerMarcas().subscribe(data => this.marcas.set(data));
    this.categoriasService.obtenerCategorias().subscribe(data => this.categorias.set(data));

    effect(() => {
      this.form.patchValue({
        nombre: this.producto().nombre,
        descripcion: this.producto().descripcion_corta,
        precio: Number(this.producto().precio_venta),
        stock: this.producto().stock,
        marca_id: this.producto().marca_id || null,
        categoria_id: this.producto().categoria_id || null,
        unidad_medida: this.producto().unidad_medida || null,
      });
    });
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardar.emit({
      ...this.producto(),
      id: this.producto().id,
      nombre: this.form.value.nombre!,
      descripcion_corta: this.form.value.descripcion!,
      precio_venta: String(this.form.value.precio!),
      stock: this.form.value.stock!,
      marca_id: this.form.value.marca_id!,
      categoria_id: this.form.value.categoria_id!,
      unidad_medida: this.form.value.unidad_medida!,
    });
  }

  onCancelar(): void {
    this.visibleChange.emit(false);
  }
}