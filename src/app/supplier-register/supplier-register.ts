import { Component, inject } from '@angular/core';
import {
  PoButtonModule,
  PoFieldModule,
  PoPageModule,
  PoNotificationService,
  PoDividerModule,
  PoContainerModule,
} from '@po-ui/ng-components';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-supplier-register',
  imports: [
    ReactiveFormsModule,
    PoButtonModule,
    PoFieldModule,
    PoPageModule,
    PoDividerModule,
    PoContainerModule,
  ],
  templateUrl: './supplier-register.html',
  styleUrl: './supplier-register.css',
})
export class SupplierRegister {
  private fb = inject(FormBuilder);
  private poNotification = inject(PoNotificationService);
  private http = inject(HttpClient);

  categoriaOpcoes = [
    { label: 'Materia-Prima', value: 'materia_prima' },
    { label: 'Serviços', value: 'servicos' },
    { label: 'Tecnologia / TI', value: 'ti' },
    { label: 'Logística e Transporte', value: 'logistica' },
  ];

  form: FormGroup = this.fb.group({
    cnpj: ['', [Validators.required, Validators.minLength(14)]],
    razaoSocial: ['', [Validators.required, Validators.minLength(3)]],
    nomeFantasia: [''],
    email: ['', [Validators.required, Validators.email]],
    cep: ['', [Validators.required, Validators.minLength(8)]],
    logradouro: ['', Validators.required],
    bairro: ['', Validators.required],
    cidade: ['', Validators.required],
    uf: ['', [Validators.required, Validators.minLength(2)]],
    numero: ['', Validators.required],
    telefone: ['', [Validators.required, Validators.minLength(10)]],
    complemento: [''],
    categoria: ['', Validators.required],
    ativo: [true],
    observacoes: [''],
  });

  buscarCnpj(): void {
    const cnpjComMascara = this.form.get('cnpj')?.value || '';
    const cnpjSemMascara = cnpjComMascara.replace(/\D/g, '');

    if (cnpjSemMascara.length !== 14) {
      return;
    }

    const url = `https://minhareceita.org/${cnpjSemMascara}`;

    this.http.get<any>(url).subscribe({
      next: (dados) => {
        this.form.patchValue({
          razaoSocial: dados.razao_social,
          nomeFantasia: dados.nome_fantasia,
          cidade: dados.municipio,
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          uf: dados.uf,
          cep: dados.cep,
          numero: dados.numero,
          complemento: dados.complemento,
          telefone: dados.ddd_telefone_1,
        });
      },
      error: (err) => {
        if (err.status === 404) {
          this.poNotification.warning('CNPJ não encontrado.');
        } else {
          this.poNotification.error('Erro ao buscar CNPJ.');
        }
      },
    });
  }

  buscarCep(): void {
    const cepComMascara = this.form.get('cep')?.value || '';
    const cepSemMascara = cepComMascara.replace(/\D/g, '');

    if (cepSemMascara.length !== 8) {
      return;
    }

    const url = `https://viacep.com.br/ws/${cepSemMascara}/json/`;

    this.http.get<any>(url).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.poNotification.warning('CEP não encontrado.');
          return;
        }

        this.form.patchValue({
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          uf: dados.uf,
        });
      },
      error: () => {
        this.poNotification.error('Erro ao buscar o CEP.');
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.poNotification.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      this.form.markAllAsTouched();
      return;
    }

    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores') || '[]');
    const novoFornecedor = this.form.value;

    const cnpjJaExiste = fornecedoresSalvos.some(
      (fornecedores: any) => fornecedores.cnpj === novoFornecedor.cnpj,
    );

    if (cnpjJaExiste) {
      this.poNotification.warning('Já existe um fornecedor cadastrado com este CNPJ!');
      return;
    }

    fornecedoresSalvos.push(novoFornecedor);
    localStorage.setItem('fornecedores', JSON.stringify(fornecedoresSalvos));

    this.poNotification.success('Fornecedor cadastrado com sucesso!');
    this.form.reset({ ativo: true });
  }

  cancelar(): void {
    this.form.reset({ ativo: true });
    this.poNotification.information('Formulário limpo!');
  }
}
