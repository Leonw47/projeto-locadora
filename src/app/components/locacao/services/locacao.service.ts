import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, first, tap } from 'rxjs';
import { Locacao } from '../models/locacao';
import { Cliente } from '../../cliente/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {

  private readonly API = 'api/locacoes';

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Locacao[]>(this.API)
      .pipe(
        first()
      );
  }

  loadByID(id: string) {
    console.log(`Tentando carregar locação com ID: ${id}`);

    return this.httpClient.get<Locacao>(`${this.API}/${id}`).pipe(
      tap(
        locacao => console.log('Locação carregada:', locacao),
        error => console.error('Erro ao carregar locação:', error)
      )
    );
  }

  save(record: Locacao) {
    return this.httpClient.post<Locacao>(this.API, record).pipe(first());
  }

  editar(record: Partial<Locacao>) {
    return this.httpClient.put<Locacao>(`${this.API}/${record._id}`, record).pipe(first());
  }

  deletar(id: string) {
    return this.httpClient.delete<string>(`${this.API}/${id}`);
  }

  getLocacoesAtivasPorCliente(clienteId: string, dataAtual?: Date) {
    const params = dataAtual ? { params: { dataAtual: new Date(dataAtual).toISOString() } } : {};
    return this.httpClient.get<Locacao[]>(`${this.API}/ativasPorCliente/${clienteId}`, params).pipe(first());
  }

  getClienteById(clienteId: string): Observable<Cliente> {
    // Implemente a lógica para buscar o cliente pelo ID na sua API
    // Retorne um Observable<Cliente>
    return this.httpClient.get<Cliente>(`${this.API}/clientes/${clienteId}`);
  }
}
