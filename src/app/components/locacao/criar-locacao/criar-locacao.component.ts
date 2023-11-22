import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {LocacaoService} from "../services/locacao.service";
import{Cliente} from "../../cliente/models/cliente";
import { ClienteService } from '../../cliente/services/cliente.service';
import { Item } from '../../item/models/item';
import { ItemService } from '../../item/services/item.service';

@Component({
  selector: 'app-criar-locacao',
  templateUrl: './criar-locacao.component.html',
  styleUrls: ['./criar-locacao.component.scss']
})
export class CriarLocacaoComponent implements OnInit {

  form: FormGroup;

  clientes: Cliente[] = [];
  alugados: Item[] = [];
  dataDevolucaoPrevista: any;
  dataDevolucaoEfetiva: any;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private service: LocacaoService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
    this.form = this.formBuilder.group({
      dataLocacao: [null, Validators.required],
      dataDevolucaoPrevista: [null, Validators.required],
      clientes: [null, Validators.required],
      alugados: [null],
      valorCobrado: [null],
      dataDevolucaoEfetiva: [null],
      multaCobrada: [null]
    }, {
      validators: [this.dataLocacaoValidator, this.dataDevolucaoPrevistaValidator]
    });
  }

  ngOnInit(): void {

    this.clienteService.list().subscribe(clientes =>{
      this.clientes = clientes;
    });

    this.itemService.list().subscribe(alugados =>{
      this.alugados = alugados;
    });
  }

  realizarLocacao(): void {
    const clientesControl = this.form.get('clientes');

    if (clientesControl?.value) {
      this.service.save(this.form.value)
        .subscribe(result => this.sucesso(), error => this.erro());
    } else {
      console.error('Nenhum cliente selecionado.');
    }
  }

  cancelar(): void {
    this.location.back();
  }

  private sucesso(){
    this.snackBar.open("Locação efetuada com sucesso!", '', {duration: 5000});
    this.cancelar();
  }
  private erro(){
    this.snackBar.open("Erro ao realizar locação.", '', {duration: 5000});
  }

  // Validador customizado para garantir que dataLocacao seja menor que dataDevolucaoPrevista
  private dataLocacaoValidator(control: { get: (arg0: string) => { (): any; new(): any; value: any; }; }) {
    const dataLocacao = control.get('dataLocacao').value;
    const dataDevolucaoPrevista = control.get('dataDevolucaoPrevista').value;

    return dataLocacao < dataDevolucaoPrevista ? null : { dataLocacaoInvalida: true };
  }

  // Validador customizado para garantir que dataDevolucaoPrevista seja maior que dataLocacao
  private dataDevolucaoPrevistaValidator(control: { get: (arg0: string) => { (): any; new(): any; value: any; }; }) {
    const dataLocacao = control.get('dataLocacao').value;
    const dataDevolucaoPrevista = control.get('dataDevolucaoPrevista').value;

    return dataDevolucaoPrevista > dataLocacao ? null : { dataDevolucaoPrevistaInvalida: true };
  }

}

