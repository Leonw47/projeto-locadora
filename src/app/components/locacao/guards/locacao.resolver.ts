import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {Locacao} from "../models/locacao";
import {LocacaoService} from "../services/locacao.service";

@Injectable({
  providedIn: 'root'
})
export class LocacaoResolver implements Resolve<Locacao> {

  constructor(
    private service: LocacaoService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Locacao> {
    if(route.params && route.params['id']){
      return this.service.loadByID(route.params['id'])
    }
    return of({
      _id: '',
      dataLocacao: '',
      dataDevolucaoPrevista: '',
      clientes: [],
      alugados: [],
      valorCobrado: 0,
      dataDevolucaoEfetiva: '',
      multaCobrada: 0
    });
  }
}
