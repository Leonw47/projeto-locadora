import {Cliente} from "../../cliente/models/cliente";
import {Item} from "../../item/models/item";

export interface Locacao{
  _id: string;
  dataLocacao: string;
  dataDevolucaoPrevista: string;
  clientes?: Cliente[];
  alugados: Item[];
  valorCobrado: number;
  dataDevolucaoEfetiva: string;
  multaCobrada: number;
}
