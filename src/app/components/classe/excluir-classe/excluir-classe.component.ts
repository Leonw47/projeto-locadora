import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Classe} from "../models/classe";
import {ClasseService} from "../services/classe.service";
import {first} from "rxjs";

@Component({
  selector: 'app-excluir-classe',
  templateUrl: './excluir-classe.component.html',
  styleUrls: ['./excluir-classe.component.scss']
})
export class ExcluirClasseComponent implements OnInit {

  public classe: Classe;
  public error: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExcluirClasseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Classe,
    private service: ClasseService,
  ) {
    this.classe = data;
  }

  ngOnInit(): void {

  }

  excluirClasse() {
    this.service.deletar(this.classe._id).pipe(first()).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.error = "Não foipossível excluir. Erro desconhecido!";
      }
    );
  }

  cancelar() {
    this.dialogRef.close(true);

  }
}
