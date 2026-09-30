import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Carrito as CarritoService } from '../../../shared/services/carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, Button, InputNumber, FormsModule],
  templateUrl: './carrito.html'
})
export class Carrito {
  carritoService = inject(CarritoService);

  cambiarCantidad(productoId: number, cantidad: number): void {
    this.carritoService.modificarCantidad(productoId, cantidad);
  }

  eliminar(productoId: number): void {
    this.carritoService.eliminarProducto(productoId);
  }
}