import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Productos } from '../../../shared/services/productos';
import { Carrito } from '../../../shared/services/carrito';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, Button],
  templateUrl: './producto-detalle.html'
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private productosService = inject(Productos);
  private carritoService = inject(Carrito);

  producto = this.productosService.obtenerPorId(
    Number(this.route.snapshot.paramMap.get('id'))
  );

  agregarAlCarrito(): void {
    if (this.producto) {
      this.carritoService.agregarProducto(this.producto);
    }
  }
}