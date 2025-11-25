import { StatusEtapa } from "../enums/StatusEtapa";
import { Funcionario } from "./funcionario";     

export class EtapaProducao {
    public nome: string;
    public prazoConclusao: Date;
    public status: StatusEtapa = StatusEtapa.PENDENTE;
    public funcionarios: Funcionario[] = [];

    constructor(nome: string, prazoConclusao: Date, status: StatusEtapa = StatusEtapa.PENDENTE) {
        this.nome = nome;
        this.prazoConclusao = prazoConclusao;
        this.status = status;
    }

    public iniciar(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            console.log(`A etapa "${this.nome}" foi iniciada.`);
        } else {
            console.log(`A etapa "${this.nome}" não pode ser iniciada.`);
        }
    }

    public finalizar(): void {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDO;
            console.log(`A etapa "${this.nome}" foi finalizada.`);
        } else {
            console.log(`A etapa "${this.nome}" não pode ser finalizada.`);
        }
    }

    public associarFuncionario(f: Funcionario): void {
        if (this.funcionarios.some(func => func.id === f.id)) {
            console.log(`O funcionario ${f.nome} ja esta nesta etapa.`);
            return;
        }
        this.funcionarios.push(f);
        console.log(`Funcionario ${f.nome} foi associado a etapa "${this.nome}".`);
    }

    public listarFuncionarios(): Funcionario[] {
        return this.funcionarios;
    }
}