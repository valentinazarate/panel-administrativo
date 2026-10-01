import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Categorias {
  private http = inject(HttpClient);
  private readonly API_CATEGORIAS = 'http://localhost:8000/api/categorias';

  obtenerCategorias() {
    return this.http.get<Categoria[]>(this.API_CATEGORIAS);
  }

  crear(categoria: Partial<Categoria>) {
    return this.http.post<Categoria>(this.API_CATEGORIAS, categoria);
  }

  actualizar(id: number, categoria: Partial<Categoria>) {
    return this.http.put<Categoria>(`${this.API_CATEGORIAS}/${id}`, categoria);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.API_CATEGORIAS}/${id}`);
  }
}