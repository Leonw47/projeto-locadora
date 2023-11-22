import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";
import { LocacaoService } from "../services/locacao.service";
import { Cliente } from "../../cliente/models/cliente";
import { ClienteService } from '../../cliente/services/cliente.service';
import { Item } from '../../item/models/item';
import { ItemService } from '../../item/services/item.service';
import { Locacao } from '../models/locacao';

@Component({
  selector: 'app-editar-locacao',
  templateUrl: './editar-locacao.component.html',
  styleUrls: ['./editar-locacao.component.scss']
})
export class EditarLocacaoComponent implements OnInit {

  form = this.formBuilder.group({
    id: [null],
    dataLocacao: [null, Validators.required],
    dataDevolucaoPrevista: [null, Validators.required],
    clientes: [null, Validators.required],
    alugados: this.formBuilder.array([]),
    valorCobrado: [null],
    dataDevolucaoEfetiva: [null],
    multaCobrada: [null]
  },
    {
      validators: [this.dataLocacaoValidator, this.dataDevolucaoPrevistaValidator]
    });

  clientes: Cliente[] = [];
  alugados: Item[] = [];
  dataDevolucaoPrevista: any;
  dataDevolucaoEfetiva: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private itemService: ItemService,
    private locacaoService: LocacaoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.clienteService.list().subscribe(clientes => {
      this.clientes = clientes;
    });

    this.itemService.list().subscribe(alugados => {
      this.alugados = alugados;
    });

    const locacao: Locacao = this.route.snapshot.data['locacao'];

    this.form.patchValue({
      id: locacao._id,
      dataLocacao: locacao.dataLocacao,
      dataDevolucaoPrevista: locacao.dataDevolucaoPrevista,
      clientes: locacao.clientes,
      valorCobrado: locacao.valorCobrado
    });

    // Popula o FormArray de alugados
    const alugadosFormArray = this.form.get('alugados') as FormArray;
    locacao.alugados.forEach(alugado => {
      alugadosFormArray.push(this.formBuilder.control(alugado));
    });
  }

  editarLocacao(): void {
    console.log(this.form.value);
    const aux: Locacao = {
      _id: this.form.get('id')?.value,
      dataLocacao: this.form.get('dataLocacao')?.value,
      dataDevolucaoPrevista: this.form.get('dataDevolucaoPrevista')?.value,
      alugados: this.form.get('alugados')?.value,
      valorCobrado: this.form.get('valorCobrado')?.value,
      clientes: this.form.get('clientes')?.value,
      dataDevolucaoEfetiva: this.form.get('dataDevolucaoEfetiva')?.value,
      multaCobrada: this.form.get('multaCobrada')?.value,
    };

    this.locacaoService.editar(aux)
      .subscribe(result => this.sucesso(), error => this.erro());
  }

  cancelar(): void {
    this.location.back();
  }

  private sucesso() {
    this.snackBar.open("Edição efetuada com sucesso!", '', { duration: 5000 });
    this.cancelar();
  }

  private erro() {
    this.snackBar.open("Erro ao realizar edição.", '', { duration: 5000 });
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

  updateAlugados() {
    const alugados = this.form.get('alugados') as FormArray | undefined;

    if (alugados) {
      const alugadosValues = alugados.value as Item[];
      alugados.setValue(alugadosValues);
    }
  }


}

