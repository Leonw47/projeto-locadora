import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Ator} from "../models/ator";
import {AtorService} from "../services/ator.service";
import {first} from "rxjs";


@Component({
  selector: 'app-excluir-ator',
  templateUrl: './excluir-ator.component.html',
  styleUrls: ['./excluir-ator.component.scss']
})
export class ExcluirAtorComponent implements OnInit {

  public ator: Ator;
  public error: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExcluirAtorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ator,
    private service: AtorService


  ) {
    this.ator = data;
  }

  ngOnInit(): void {

  }

  excluirAtor() {
    this.service.deletar(this.ator._id).pipe(first()).subscribe(
      () => {
        // Se a exclusão for bem-sucedida, feche o diálogo.
        this.dialogRef.close(true);
      },
      (error) => {
        // Em caso de erro, capture a mensagem de erro do backend.
        this.error = "Não foi possível excluir. Erro desconhecido!"; // Suponhamos que o erro seja retornado como uma propriedade 'message' no objeto de erro.
      }
    );
  }

  cancelar() {
    this.dialogRef.close(true);

  }
}
