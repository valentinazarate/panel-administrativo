import { Component, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';

export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [ReactiveFormsModule, Dialog, InputText, Textarea, Button],
  templateUrl: './marca-form.html'
})
export class MarcaForm {
  visible = input.required<boolean>();
  marca = input.required<Marca>();

  visibleChange = output<boolean>();
  guardar = output<Marca>();

  private fb = new FormBuilder();

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        nombre: this.marca().nombre,
        descripcion: this.marca().descripcion,
      });
    });
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardar.emit({
      id: this.marca().id,
      nombre: this.form.value.nombre!,
      descripcion: this.form.value.descripcion!,
    });
  }

  onCancelar(): void {
    this.visibleChange.emit(false);
  }
}