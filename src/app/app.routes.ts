import { Routes } from '@angular/router';
import { SupplierList } from './supplier-list/supplier-list';
import { SupplierRegister } from './supplier-register/supplier-register';

export const routes: Routes = [
    {path: 'fornecedores', component: SupplierList}, 
    {path: 'fornecedores/novo', component: SupplierRegister}, 
    {path: '', redirectTo: 'fornecedores', pathMatch:'full'}

];
