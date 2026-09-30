import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Button } from 'primeng/button';
import { Productos, Producto } from '../../../shared/services/productos';
import { Carrito } from '../../../shared/services/carrito';

@Component({
  selector: 'app-catalogo-list',
  standalone: true,
  imports: [RouterLink, FormsModule, InputText, Select, Slider, Button, CurrencyPipe],
  templateUrl: './catalogo-list.html'
})
export class CatalogoList {
  private productosService = inject(Productos);
  private carritoService = inject(Carrito);
  productos = this.productosService.productos;

  busqueda = signal('');
  categoriaSeleccionada = signal<string | null>(null);
  marcaSeleccionada = signal<string | null>(null);
  precioMax = signal(10000);
  orden = signal<'asc' | 'desc' | null>(null);

  categorias = computed(() => [...new Set(this.productos().map(p => p.categoria))]);
  marcas = computed(() => [...new Set(this.productos().map(p => p.marca))]);

  productosFiltrados = computed(() => {
    let resultado = this.productos();

    const texto = this.busqueda().toLowerCase().trim();
    if (texto) {
      resultado = resultado.filter(p => p.nombre.toLowerCase().includes(texto));
    }

    if (this.categoriaSeleccionada()) {
      resultado = resultado.filter(p => p.categoria.nombre === this.categoriaSeleccionada());
    }

    if (this.marcaSeleccionada()) {
      resultado = resultado.filter(p => p.marca.nombre === this.marcaSeleccionada());
    }

    resultado = resultado.filter(p => +p.precio_venta <= this.precioMax());

    if (this.orden() === 'asc') {
      resultado = [...resultado].sort((a, b) => +a.precio_venta - +b.precio_venta);
    } else if (this.orden() === 'desc') {
      resultado = [...resultado].sort((a, b) => +b.precio_venta - +a.precio_venta);
    }

    return resultado;
  });

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoriaSeleccionada.set(null);
    this.marcaSeleccionada.set(null);
    this.precioMax.set(10000);
    this.orden.set(null);
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.carritoService.agregarProducto(producto);
  }
}