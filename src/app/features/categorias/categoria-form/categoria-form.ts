import { Component, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Categoria } from '../../../shared/services/categorias';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [ReactiveFormsModule, Dialog, InputText, Textarea, Button],
  templateUrl: './categoria-form.html'
})
export class CategoriaForm {
  visible = input.required<boolean>();
  categoria = input.required<Categoria>();

  visibleChange = output<boolean>();
  guardar = output<Categoria>();

  private fb = new FormBuilder();

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        nombre: this.categoria().nombre,
        descripcion: this.categoria().descripcion ?? '',
      });
    });
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardar.emit({
      ...this.categoria(),
      nombre: this.form.value.nombre!,
      descripcion: this.form.value.descripcion!,
    });
  }

  onCancelar(): void {
    this.visibleChange.emit(false);
  }
}