import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Marca {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  logo: string | null;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Marcas {
  private http = inject(HttpClient);
  private readonly API_MARCAS = 'http://localhost:8000/api/marcas';

  obtenerMarcas() {
    return this.http.get<Marca[]>(this.API_MARCAS);
  }

  crear(marca: Partial<Marca>) {
    return this.http.post<Marca>(this.API_MARCAS, marca);
  }

  actualizar(id: number, marca: Partial<Marca>) {
    return this.http.put<Marca>(`${this.API_MARCAS}/${id}`, marca);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.API_MARCAS}/${id}`);
  }
}