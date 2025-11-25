import { Peca } from "../classes/peca";
import { FileManager } from "../classes/fileManager";
import * as path from 'path';

export class PecaService {
    private pecas: Peca[] = [];
    private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'pecas.json');

    constructor() {
        this.carregar();
    }

    public cadastrar(peca: Peca): void {
        const existente = this.pecas.find(p => p.nome === peca.nome);
        if (existente) {
            console.log(`Peca com nome ${peca.nome} ja existe!`);
            return;
        }
        this.pecas.push(peca);
        this.salvar();
        console.log("Peca cadastrada com sucesso!");
    }

    public listar(): Peca[] {
        return this.pecas;
    }

    public buscarPorNome(nome: string): Peca | undefined {
        return this.pecas.find(p => p.nome === nome);
    }

    public atualizarStatus(nome: string, novoStatus: any): void {
        const peca = this.buscarPorNome(nome);
        if (peca) {
            peca.atualizarStatus(novoStatus);
            this.salvar();
        }
    }

    private salvar(): void {
        FileManager.salvar(PecaService.dataFilePath, this.pecas);
    }

    private carregar(): void {
        this.pecas = FileManager.carregar<Peca>(PecaService.dataFilePath);
    }
}