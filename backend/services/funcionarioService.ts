import { prisma } from "../db";

export class FuncionarioService {

    public async cadastrar(dados: any): Promise<void> {
        const existente = await prisma.funcionario.findFirst({
            where: { OR: [{ id: dados.id }, { usuario: dados.usuario }] }
        });

        if (existente) {
            throw new Error("Funcionário já existe!");
        }

        await prisma.funcionario.create({
            data: {
                nome: dados.nome,
                telefone: dados.telefone,
                endereco: dados.endereco,
                usuario: dados.usuario,
                senha: dados.senha, 
                nivelPermissao: dados.nivelPermissao
            }
        });
        console.log("Funcionário cadastrado!");
    }

    public async listar() {
        return await prisma.funcionario.findMany();
    }

    public async buscarPorUsuario(usuario: string) {
        return await prisma.funcionario.findUnique({
            where: { usuario }
        });
    }

    public async autenticar(usuario: string, senha: string) {
        const funcionario = await prisma.funcionario.findUnique({
            where: { usuario }
        });

        if (funcionario && funcionario.senha === senha) {
            return funcionario;
        }
        return null;
    }
}