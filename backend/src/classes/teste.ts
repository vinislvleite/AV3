import { TipoTeste } from "../enums/TipoTeste";
import { ResultadoTeste } from "../enums/ResultadoTeste";

export class Teste {
    tipo: TipoTeste;
    resultado: ResultadoTeste;

    constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
        if (!Object.values(TipoTeste).includes(tipo)) {
            throw new Error(`Tipo de teste inválido!\nValores aceitos: ${Object.values(TipoTeste).join(", ")}.`);
        }
        this.tipo = tipo;

        if (!Object.values(ResultadoTeste).includes(resultado)) {
            throw new Error(`Resultado de teste inválido!\nValores aceitos: ${Object.values(ResultadoTeste).join(", ")}.`);
        }
        this.resultado = resultado;
    }

    salvar(): void {
        console.log(`Teste do tipo "${this.tipo}" salvo com resultado "${this.resultado}".`);
    }

    carregar(): void {
        console.log(`Teste do tipo "${this.tipo}" carregado.`);
    }
}