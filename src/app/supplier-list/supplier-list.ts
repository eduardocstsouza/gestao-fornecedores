import { Component, OnInit, inject } from '@angular/core';
import { PoPageModule, PoFieldModule, PoTableModule, PoButtonModule, PoTableColumn } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-list',
  imports: [PoPageModule, PoTableModule, PoButtonModule, PoFieldModule, FormsModule],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList implements OnInit {

  private router = inject(Router);

  todosFornecedores: Array<any> = []
  termoBusca: string = '';

  fornecedores: Array<any> = [];
  colunas: Array<PoTableColumn> = [
    {property: 'cnpj', label: 'CNPJ'}, 
    {property: 'razaoSocial', label: 'Razão Social'}, 
    {property: 'email', label: 'E-mail'},
    {property: 'telefone', label: 'Telefone'},
    {property: 'cidade', label: 'Cidade'},
    {property: 'uf', label:'UF'}
  ];
  
  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void{
    this.todosFornecedores = JSON.parse(localStorage.getItem('fornecedores') || '[]');
    this.fornecedores = this.todosFornecedores;
  }


  novoFornecedor(): void {
    this.router.navigate(['/fornecedores/novo']);
  }

  filtrarFornecedores(): void {
    const termo = this.termoBusca.toLowerCase();
    this.fornecedores = this.todosFornecedores.filter((fornecedor) =>
      fornecedor.razaoSocial?.toLowerCase().includes(termo) ||
      fornecedor.cnpj?.includes(termo) ||
      fornecedor.cidade?.toLowerCase().includes(termo)
    );
  }
}
