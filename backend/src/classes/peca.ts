import { StatusPeca } from "../enums/StatusPeca";
import { TipoPeca } from "../enums/TipoPeca";

export class Peca {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nome = nome;
        this.fornecedor = fornecedor;

        if (!Object.values(TipoPeca).includes(tipo)) {
            throw new Error(`Tipo de peça inválido!\nValores aceitos: ${Object.values(TipoPeca).join(", ")}.`);
        }
        this.tipo = tipo;

        if (!Object.values(StatusPeca).includes(status)) {
            throw new Error(`Status de peça inválido!\nValores aceitos: ${Object.values(StatusPeca).join(", ")}.`);
        }
        this.status = status;
    }

    atualizarStatus(novoStatus: StatusPeca): void {
        if (!Object.values(StatusPeca).includes(novoStatus)) {
            throw new Error(`Novo status inválido`);
        }

        console.log(
            `Peça: "${this.nome}" status atualizado de "${this.status}" para "${novoStatus}".`
        );
        this.status = novoStatus;
    }

    salvar(): void {
        console.log(`Peça "${this.nome}" salva com sucesso.`);
    }

    carregar(): void {
        console.log(`Dados da peça "${this.nome}" carregados.`);
    }
}