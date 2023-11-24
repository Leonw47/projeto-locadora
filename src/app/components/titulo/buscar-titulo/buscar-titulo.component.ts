import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TituloService } from '../services/titulo.service';
import { Titulo } from '../models/titulo';


@Component({
  selector: 'app-buscar-titulo',
  templateUrl: './buscar-titulo.component.html',
  styleUrls: ['./buscar-titulo.component.scss']
})
export class BuscarTituloComponent implements OnInit {
  searchTerm: string = '';
  titulos: Titulo[] = [];
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private tituloService: TituloService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.search();
    });
  }

  search(): void {
    this.loading = true; // Mostra o loading

    if (this.searchTerm.trim() !== '') {
      this.tituloService.searchTitulos(this.searchTerm).subscribe(
        titulos => {
          this.titulos = titulos;
          this.setLoadingTimeout(); // Configura o temporizador para ocultar o loading
        },
        error => {
          console.error('Erro ao buscar títulos', error);
          this.loading = false; // Oculta o loading em caso de erro
        }
      );
    } else {
      // Se a barra de pesquisa estiver vazia, pode implementar uma lógica para lidar com isso
      // Por exemplo, carregar todos os títulos
      this.tituloService.list().subscribe(
        titulos => {
          this.titulos = titulos;
          this.setLoadingTimeout(); // Configura o temporizador para ocultar o loading
        },
        error => {
          console.error('Erro ao buscar títulos', error);
          this.loading = false; // Oculta o loading em caso de erro
        }
      );
    }
  }

  setLoadingTimeout(): void {
    setTimeout(() => {
      this.loading = false; // Oculta o loading após 1000 milissegundos (1 segundo)
    }, 2000);
  }
}
