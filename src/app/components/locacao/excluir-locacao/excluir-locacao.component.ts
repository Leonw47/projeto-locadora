import {Component, Inject, OnInit} from '@angular/core';
import {Locacao} from "../models/locacao";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LocacaoService} from "../services/locacao.service";
import {first} from "rxjs";

@Component({
  selector: 'app-excluir-locacao',
  templateUrl: './excluir-locacao.component.html',
  styleUrls: ['./excluir-locacao.component.scss']
})
// ... (seu código existente)

export class ExcluirLocacaoComponent implements OnInit {

  public locacao: Locacao;
  public deletandoLocacao = false;
  public exclusaoSucesso = false;
  public exclusaoErro = false;

  constructor(
    public dialogRef: MatDialogRef<ExcluirLocacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Locacao,
    private service: LocacaoService,
  ) {
    this.locacao = data;
  }

  ngOnInit(): void {
  }

  excluirLocacao(): void {
    this.deletandoLocacao = true;

    this.service.deletar(this.locacao._id).pipe(first()).subscribe(
      () => {
        console.log('Locação excluída com sucesso.');
        this.exclusaoSucesso = true;
        this.dialogRef.close(true);
      },
      error => {
        console.error('Erro ao excluir locação:', error);
        this.exclusaoErro = true;
      });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
