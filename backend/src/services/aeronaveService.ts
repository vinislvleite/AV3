import { Aeronave } from "../classes/aeronave";
import { TipoAeronave } from "../enums/TipoAeronave";

export class AeronaveService {
    private aeronaves: Aeronave[] = [];

    constructor() {
        Aeronave.carregar(this.aeronaves);
    }

    public cadastrar(aeronave: Aeronave): void {
        const existente = this.aeronaves.find(a => a.codigo === aeronave.codigo);
        if (existente) {
            console.log(`Aeronave com código ${aeronave.codigo} já existe!`);
            return;
        }
        this.aeronaves.push(aeronave);
        Aeronave.salvar(this.aeronaves);
    }

    public listar(): Aeronave[] {
        return this.aeronaves;
    }

    public buscarPorCodigo(codigo: string): Aeronave | undefined {
        return this.aeronaves.find(a => a.codigo === codigo);
    }

    public remover(codigo: string): void {
        const index = this.aeronaves.findIndex(a => a.codigo === codigo);
        if (index !== -1) {
            this.aeronaves.splice(index, 1);
            Aeronave.salvar(this.aeronaves);
            console.log(`Aeronave ${codigo} removida!`);
        } else {
            console.log(`Aeronave com código ${codigo} não encontrada!`);
        }
    }

    public atualizar(codigo: string, dados: Partial<Aeronave>): void {
        const aeronave = this.buscarPorCodigo(codigo);
        if (!aeronave) {
            console.log(`Aeronave ${codigo} não encontrada!`);
            return;
        }

        Object.assign(aeronave, dados);

        Aeronave.salvar(this.aeronaves);
        console.log(`Aeronave ${codigo} atualizada!`);
    }
}
