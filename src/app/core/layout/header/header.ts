import { Component, inject, viewChild } from '@angular/core';
import { Layout } from '../layout';
import { Menu } from 'primeng/menu';
import { Avatar } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Menu, Avatar],
  templateUrl: './header.html'
})
export class Header {
  layout = inject(Layout);
  menu = viewChild.required<Menu>('menu');

  menuItems: MenuItem[] = [
    { label: 'Mi perfil', icon: 'pi pi-user' },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out' }
  ];

  toggleMenu(event: Event): void {
    this.menu().toggle(event);
  }
}