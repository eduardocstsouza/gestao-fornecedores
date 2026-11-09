import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierRegister } from './supplier-register/supplier-register';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SupplierRegister],
  template: `<app-supplier-register></app-supplier-register>`,
})
export class App {}