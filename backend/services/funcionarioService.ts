import { prisma } from "../db";

export class FuncionarioService {

    public async cadastrar(dados: any): Promise<void> {
        const existente = await prisma.funcionario.findFirst({
            where: { usuario: dados.usuario }
        });

        if (existente) {
            throw new Error(`O usuário ${dados.usuario} já existe!`);
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
    }

    public async listar() {
        return await prisma.funcionario.findMany();
    }

    public async buscarPorId(id: number) {
        return await prisma.funcionario.findUnique({
            where: { id }
        });
    }

    public async buscarPorUsuario(usuario: string) {
        return await prisma.funcionario.findUnique({
            where: { usuario }
        });
    }

    public async remover(id: number): Promise<void> {
        const funcionario = await prisma.funcionario.findUnique({ where: { id } });
        if (!funcionario) {
            throw new Error("Funcionário não encontrado.");
        }

        await prisma.funcionario.delete({
            where: { id }
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