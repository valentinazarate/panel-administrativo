import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive  } from '@angular/router';
import { Layout } from '../layout';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class Sidebar {
  layout = inject(Layout);
}