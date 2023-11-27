import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  showErrorMessage: boolean = false;

  displayedColumns = ['nome', 'ano', 'sinopse', 'categoria', 'diretor', 'ator', 'acao'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tituloService: TituloService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.search();
    });
  }

  onSearchInput(): void {
    // Adicione aqui qualquer lógica desejada ao digitar no campo de pesquisa
  }

  search(): void {
    // Reseta a lista de títulos, o status de carregamento e oculta a mensagem de erro
    this.titulos = [];
    this.loading = true;
    this.showErrorMessage = false;

    // Adicione uma verificação para evitar pesquisas em branco ou curtas demais
    if (this.searchTerm.trim().length < 3) {
      this.loading = false;
      return;
    }

    // Chama o serviço para buscar os títulos
    this.tituloService.searchTitulos(this.searchTerm).subscribe(
      titulos => {
        this.titulos = titulos;
        this.setLoadingTimeout(); // Configura o temporizador para ocultar o loading

        // Se nenhum título for encontrado, exibe a mensagem de erro
        if (titulos.length === 0) {
          this.showErrorMessage = true;
        }
      },
      error => {
        console.error('Erro ao buscar títulos', error);
        this.loading = false; // Oculta o loading em caso de erro
      }
    );
  }

  setLoadingTimeout(): void {
    setTimeout(() => {
      this.loading = false; // Oculta o loading após 2000 milissegundos (2 segundos)
    }, 2000);
  }

  irParaLocacao(): void {
    this.router.navigate(['/locacao/criarLocacao']);
  }
}
