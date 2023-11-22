import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";
import { Locacao } from '../models/locacao';
import { LocacaoService } from "../services/locacao.service";
import { Cliente } from '../../cliente/models/cliente';
import { ClienteService } from '../../cliente/services/cliente.service';
import { Item } from '../../item/models/item';
import { ItemService } from '../../item/services/item.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-realizar-devolucao',
  templateUrl: './realizar-devolucao.component.html',
  styleUrls: ['./realizar-devolucao.component.scss']
})
export class RealizarDevolucaoComponent implements OnInit {

  form!: FormGroup;
  clientes: Cliente[] = [];
  alugados: Item[] = [];
  locacoesAtivas: Locacao[] = [];
  alugadosFormatados: string = '';

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private service: LocacaoService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.clienteService.list().subscribe(clientes => {
      this.clientes = clientes;
    });

    this.itemService.list().subscribe(alugados => {
      this.alugados = alugados;
    });

    this.form.get('clientes')?.valueChanges.subscribe(clienteId => {
      console.log('Cliente selecionado:', clienteId);
      if (clienteId) {
        this.carregarLocacoesAtivas(clienteId);
      }
    });

    this.form.get('locacaoAtiva')?.valueChanges.subscribe(() => {
      console.log('Valor de locacaoAtiva alterado para:', this.form.get('locacaoAtiva')?.value);
      this.onLocacaoAtivaChange();
    });

    this.route.params.subscribe(params => {
      console.log('Parâmetros da rota:', params);
      const locacaoId = params['_id'];
      if (locacaoId) {
        this.carregarLocacao(locacaoId);
      }
    });
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      _id: [null, Validators.required],
      dataLocacao: [null],
      dataDevolucaoPrevista: [null],
      clientes: [null, Validators.required],
      alugados: [null, Validators.required],
      valorCobrado: [null],
      dataDevolucaoEfetiva: [null, Validators.required],
      multaCobrada: [null],
      locacaoAtiva: [null]
    }, {
      validators: [this.dataDevolucaoEfetivaValidator]
    });
  }

  carregarLocacao(locacaoId: string): void {
    this.service.loadByID(locacaoId).subscribe((locacao) => {
      this.form.patchValue({
        _id: locacao._id,
        dataLocacao: locacao.dataLocacao,
        dataDevolucaoPrevista: locacao.dataDevolucaoPrevista,
        clientes: locacao.clientes,
        alugados: locacao.alugados,
        valorCobrado: locacao.valorCobrado
      });
    });
  }

  carregarLocacoesAtivas(clienteId: string): void {
    console.log('Método carregarLocacoesAtivas chamado para o cliente:', clienteId);

    this.service.getLocacoesAtivasPorCliente(clienteId).subscribe(locacoes => {
      console.log('Locações ativas carregadas:', locacoes);

      this.locacoesAtivas = locacoes;

      // Limpar detalhes da locação ao carregar novas locações
      this.form.patchValue({
        locacaoAtiva: null,
        dataDevolucaoPrevista: null,
        alugados: null,
        valorCobrado: null
      });
    });
  }

  onLocacaoAtivaChange() {
    const locacaoAtivaControl = this.form.get('locacaoAtiva');

    if (locacaoAtivaControl && locacaoAtivaControl.value) {
      console.log('Locações Ativas:', this.locacoesAtivas);
      console.log('Valor de locacaoAtivaControl.value:', locacaoAtivaControl.value);

      const locacao = this.locacoesAtivas.find(l => l._id == locacaoAtivaControl.value);

      if (locacao) {
        this.form.patchValue({
          dataLocacao: locacao.dataLocacao,
          dataDevolucaoPrevista: locacao.dataDevolucaoPrevista,
          alugados: locacao.alugados,
          valorCobrado: locacao.valorCobrado,
        });

        this.alugadosFormatados = locacao.alugados.map((alugado: { titulo: { nome: any; } }) => alugado.titulo.nome).join(', ');
        this.form.get('alugados')?.setValue(locacao.alugados);

        console.log('Locação Ativa Encontrada:', locacao);
      } else {
        console.error('Locação Ativa não encontrada.');
        console.log('Valor de this.locacoesAtivas:', this.locacoesAtivas);
        console.log('Tipo de locacaoAtivaControl.value:', typeof locacaoAtivaControl.value);
        console.log('locacaoAtivaControl.value:', locacaoAtivaControl.value);
        this.resetarFormulario();
      }
    } else {
      this.resetarFormulario();
    }
  }



  resetarFormulario() {
    this.form.patchValue({
      dataDevolucaoPrevista: null,
      alugados: null,
      valorCobrado: null,
    });

    this.alugadosFormatados = '';
    this.form.get('alugados')?.setValue(null);
  }

  devolver(): void {
    const clientesControl = this.form.get('clientes');
    const locacaoAtivaControl = this.form.get('locacaoAtiva');

    if (clientesControl?.value && locacaoAtivaControl?.value !== null && locacaoAtivaControl?.value !== undefined) {
      const idCliente = clientesControl.value;
      const dataDevolucaoEfetiva = this.form.get('dataDevolucaoEfetiva')?.value;
      const multaCobrada = this.form.get('multaCobrada')?.value;

      console.log('ID da Locação Ativa do Formulário:', locacaoAtivaControl.value);

      // Imprime no console os IDs de todas as locações ativas
      console.log('IDs das Locações Ativas Disponíveis:', this.locacoesAtivas.map(l => l._id));

      // Obter informações da locação ativa do formulário
      const locacaoAtiva = this.locacoesAtivas.find(l => l._id === locacaoAtivaControl.value);

      console.log('Locação Ativa Encontrada:', locacaoAtiva);

      if (locacaoAtiva) {
        this.service.getClienteById(idCliente).subscribe(cliente => {
          const locacao: Locacao = {
            _id: '',  // Se for um novo registro, você pode deixar o ID em branco
            dataLocacao: locacaoAtiva.dataLocacao,
            dataDevolucaoPrevista: locacaoAtiva.dataDevolucaoPrevista,
            alugados: [],  // ou outra lógica para itens alugados
            valorCobrado: locacaoAtiva.valorCobrado,
            clientes: locacaoAtiva.clientes,  // Certifique-se de que está retornando um objeto cliente válido
            dataDevolucaoEfetiva: dataDevolucaoEfetiva,
            multaCobrada: multaCobrada,
            // Adicione outros campos conforme necessário
          };

          this.service.save(locacao)
            .subscribe(result => this.sucesso(), error => this.erro());
        });
      } else {
        console.error('Locação ativa não encontrada.');
      }
    } else {
      console.error('Nenhum cliente ou locação ativa selecionada.');
    }
  }


  cancelar(): void {
    this.location.back();
  }

  private sucesso() {
    this.snackBar.open("Devolução realizada com sucesso!", '', { duration: 5000 });
    this.cancelar();
  }

  private erro() {
    this.snackBar.open("Erro ao realizar devolução.", '', { duration: 5000 });
  }

  private dataDevolucaoEfetivaValidator(control: { get: (arg0: string) => { (): any; new(): any; value: any; }; }) {
    const dataDevolucaoEfetiva = control.get('dataDevolucaoEfetiva').value;
    return dataDevolucaoEfetiva ? null : { dataDevolucaoEfetivaInvalida: true };
  }

  formatarData(data: Date): string {
    const dataFormatada = this.datePipe.transform(data, 'dd/MM/yyyy');
    return dataFormatada !== null && dataFormatada !== undefined ? dataFormatada : '';
  }

  get itensAlugados(): Item[] {
    const locacaoAtiva = this.form.get('locacaoAtiva')?.value;
    return locacaoAtiva ? locacaoAtiva.alugados : [];
  }

  getAlugadosFormatted(): string {
    const locacaoAtiva = this.form.get('locacaoAtiva')?.value;
    if (locacaoAtiva && locacaoAtiva.alugados) {
      return locacaoAtiva.alugados.map((alugado: { titulo: { nome: any; }; }) => alugado.titulo.nome).join(', ');
    }
    return '';
  }

  realizarDevolucaoDisponivel(): boolean {
    const formValid = this.form.valid;
    const locacaoAtiva = this.form.get('locacaoAtiva')?.value;
    return formValid && locacaoAtiva !== null && locacaoAtiva.alugados.length > 0;
  }
}
