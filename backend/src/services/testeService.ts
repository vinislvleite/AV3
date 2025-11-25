import { Teste } from "../classes/teste";
import { FileManager } from "../classes/fileManager";
import * as path from 'path';

export class TesteService {
    private testes: Teste[] = [];
    private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'testes.json');

    constructor() {
        this.carregar();
    }

    public cadastrar(teste: Teste): void {
        this.testes.push(teste);
        this.salvar();
        console.log("Teste cadastrado com sucesso!");
    }

    public listar(): Teste[] {
        return this.testes;
    }

    private salvar(): void {
        FileManager.salvar(TesteService.dataFilePath, this.testes);
    }

    private carregar(): void {
        this.testes = FileManager.carregar<Teste>(TesteService.dataFilePath);
    }
}