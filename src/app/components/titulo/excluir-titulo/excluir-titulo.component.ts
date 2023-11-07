import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {first} from "rxjs";
import {Titulo} from "../models/titulo";
import {TituloService} from "../services/titulo.service";

@Component({
  selector: 'app-excluir-titulo',
  templateUrl: './excluir-titulo.component.html',
  styleUrls: ['./excluir-titulo.component.scss']
})
export class ExcluirTituloComponent implements OnInit {

  public titulo: Titulo;
  public error: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExcluirTituloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Titulo,
    private service: TituloService,
  ) {
    this.titulo = data;
  }

  ngOnInit(): void {

  }

  excluirTitulo() {
    this.service.deletar(this.titulo._id).pipe(first()).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.error = "Não foi possível excluir. Erro desconhecido!";
      }
    );
  }

  cancelar() {
    this.dialogRef.close(true);

  }

}
