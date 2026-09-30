import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Carrito } from '../../../shared/services/carrito';

@Component({
  selector: 'app-store-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store-header.html'
})
export class StoreHeader {
  carritoService = inject(Carrito);
}