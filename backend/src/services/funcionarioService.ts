import { Funcionario } from "../classes/funcionario";
import { FileManager } from "../classes/fileManager";
import * as path from 'path';

export class FuncionarioService {
    private funcionarios: Funcionario[] = [];
    private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'funcionarios.json');

    constructor() {
        this.carregar();
    }

    public cadastrar(funcionario: Funcionario): void {
        const existente = this.funcionarios.find(f => f.id === funcionario.id || f.usuario === funcionario.usuario);
        if (existente) {
            console.log(`Funcionario com ID ${funcionario.id} ou usuario ${funcionario.usuario} ja existe!`);
            return;
        }
        this.funcionarios.push(funcionario);
        this.salvar();
        console.log("Funcionario cadastrado com sucesso!");
    }

    public listar(): Funcionario[] {
        return this.funcionarios;
    }

    public buscarPorUsuario(usuario: string): Funcionario | undefined {
        return this.funcionarios.find(f => f.usuario === usuario);
    }

    public autenticar(usuario: string, senha: string): Funcionario | undefined {
        return this.funcionarios.find(f => f.autenticar(usuario, senha));
    }

    private salvar(): void {
        FileManager.salvar(FuncionarioService.dataFilePath, this.funcionarios);
    }

    private carregar(): void {
        const data: any[] = FileManager.carregar(FuncionarioService.dataFilePath) || [];
        this.funcionarios = data.map(f => new Funcionario(
            f.id,
            f.nome,
            f.telefone,
            f.endereco,
            f.usuario,
            f.senha,
            f.nivelPermissao
        ));
    }
}
