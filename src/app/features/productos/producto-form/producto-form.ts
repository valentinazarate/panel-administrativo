import { Component, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Producto } from '../../../shared/services/productos';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, Dialog, InputText, InputNumber, Textarea, Button],
  templateUrl: './producto-form.html'
})
export class ProductoForm {
  visible = input.required<boolean>();
  producto = input.required<Producto>();

  visibleChange = output<boolean>();
  guardar = output<Producto>();

  private fb = new FormBuilder();

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        nombre: this.producto().nombre,
        descripcion: this.producto().descripcion_corta,
        precio: Number(this.producto().precio_venta),
        stock: this.producto().stock,
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
    });
  }

  onCancelar(): void {
    this.visibleChange.emit(false);
  }
}