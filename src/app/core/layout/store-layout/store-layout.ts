import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreHeader } from '../store-header/store-header';
import { StoreFooter } from '../store-footer/store-footer';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [RouterOutlet, StoreHeader, StoreFooter],
  templateUrl: './store-layout.html'
})
export class StoreLayout {}
