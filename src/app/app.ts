import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PoMenuModule, PoToolbarModule, PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PoMenuModule, PoToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menus: Array<PoMenuItem> = [
    {label: 'Fornecedores', link: '/fornecedores', icon: 'an an-users'}, 
    {label: 'Novo Fornecedor', link:'/fornecedores/novo', icon: 'an an-user-plus' }
  
  ]
}