import { TipoAeronave } from "../enums/TipoAeronave";
import { FileManager } from "./fileManager";
import * as path from 'path';

export class Aeronave {
 private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'aeronaves.json');

 public codigo: string;
 public modelo: string;
 public tipo: TipoAeronave;
 public capacidade: number;
 public alcance: number;
 public cliente: string;
 public dataEntrega: string;

 constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number, cliente: string, dataEntrega: string) {
     this.codigo = codigo;
     this.modelo = modelo;
     this.tipo = this.validarTipo(tipo);
     this.capacidade = capacidade;
     this.alcance = alcance;
     this.cliente = cliente;
     this.dataEntrega = dataEntrega;
 }

 private validarTipo(tipo: TipoAeronave): TipoAeronave {
     return tipo;
 }
 
 public detalhes(): string {
     return `
--- Detalhes da Aeronave ${this.codigo} ---
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance}
Cliente: ${this.cliente}
Data de Entrega: ${this.dataEntrega}
------------------------------------`;
 }

 public static carregar(arrayDestino: Aeronave[]): void {
     const aeronavesObjeto = FileManager.carregar<Aeronave>(this.dataFilePath);
     const aeronavesCarregadas = aeronavesObjeto.map(a => new Aeronave(
         a.codigo,
         a.modelo,
         a.tipo,
         a.capacidade,
         a.alcance,
         a.cliente,
         a.dataEntrega,
     ));

     arrayDestino.push(...aeronavesCarregadas);
 }

 public static salvar(aeronaves: Aeronave[]): void {
     FileManager.salvar(this.dataFilePath, aeronaves);
 }
}