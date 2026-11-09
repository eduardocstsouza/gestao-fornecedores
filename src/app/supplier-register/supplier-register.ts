import { Component, inject } from '@angular/core';
import { PoButtonModule, PoFieldModule, PoPageModule, PoNotificationService } from '@po-ui/ng-components';
import {HttpClient} from '@angular/common/http';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-supplier-register',
  imports: [
    ReactiveFormsModule,
    PoButtonModule, 
    PoFieldModule, 
    PoPageModule,
  ],
  templateUrl: './supplier-register.html',
  styleUrl: './supplier-register.css',
})

export class SupplierRegister {

  private fb = inject(FormBuilder);
  private poNotification = inject(PoNotificationService);
  private http = inject(HttpClient);

  form: FormGroup = this.fb.group({
    cnpj: ['', Validators.required],
    razaoSocial: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cep: ['', Validators.required],
    logradouro: ['', Validators.required],
    bairro: ['', Validators.required],
    cidade: ['', Validators.required],
    uf: ['', Validators.required]

  });

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
          uf: dados.uf
        });
      },
      error: () => {
        this.poNotification.error('Erro ao buscar o CEP.');
      }

    });
  }


  salvar(): void {
    if (this.form.invalid) {
      this.poNotification.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      this.form.markAllAsTouched();
      return;
    }
    console.log('---Dados do formulário---');
    console.log(this.form.value);

    this.poNotification.success('Fornecedor cadastrado com sucesso!');
 
  };

  cancelar(): void {
    this.form.reset();
    this.poNotification.information('Formulário limpo!');
  }
}
