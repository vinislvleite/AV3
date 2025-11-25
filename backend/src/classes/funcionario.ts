import { Permissao } from "../enums/NivelPermissao";
import * as fs from 'fs';
import * as path from 'path';

export class Funcionario {
    private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'funcionarios.json');

    public readonly id: string;
    public nome: string;
    public telefone: string;
    public endereco: string;
    public usuario: string;
    private senha: string;
    public nivelPermissao: Permissao;

    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: Permissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    public autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.senha === senha;
    }

    public salvar(): void {
        let funcionarios: any[] = [];

        try {
            const fileData = fs.readFileSync(Funcionario.dataFilePath, 'utf-8');
            funcionarios = JSON.parse(fileData);
        } catch {
            funcionarios = [];
        }

        const index = funcionarios.findIndex((f: any) => f.id === this.id);

        if (index >= 0) {
            funcionarios[index] = this;
        } else {
            funcionarios.push(this);
        }

        const dir = path.dirname(Funcionario.dataFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(Funcionario.dataFilePath, JSON.stringify(funcionarios, null, 2), 'utf-8');
    }

    public carregar(): void {
        try {
            const fileData = fs.readFileSync(Funcionario.dataFilePath, 'utf-8');
            const funcionarios = JSON.parse(fileData);

            const encontrado = funcionarios.find((f: any) => f.id === this.id);

            if (encontrado) {
                this.nome = encontrado.nome;
                this.telefone = encontrado.telefone;
                this.endereco = encontrado.endereco;
                this.usuario = encontrado.usuario;
                this.senha = encontrado.senha;
                this.nivelPermissao = encontrado.nivelPermissao;
            }
        } catch {
            
        }
    }
}
