import { prisma } from "../db";
import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; 

export class FuncionarioService {

    public async cadastrar(dados: any): Promise<void> {
        const existente = await prisma.funcionario.findFirst({
            where: { usuario: dados.usuario }
        });

        if (existente) {
            throw new Error(`O usuário ${dados.usuario} já existe.`); 
        }

        const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

        try {
            await prisma.funcionario.create({
                data: {
                    nome: dados.nome,
                    telefone: dados.telefone,
                    endereco: dados.endereco,
                    usuario: dados.usuario,
                    senha: senhaHash, 
                    nivelPermissao: dados.nivelPermissao
                }
            });
        } catch (error) {
             throw new Error("Falha ao cadastrar funcionário no banco de dados.");
        }
    }
    
    public async autenticar(usuario: string, senha: string) {
        const funcionario = await prisma.funcionario.findUnique({
            where: { usuario }
        });

        if (!funcionario) {
            return null;
        }
        
        const senhaCorreta = await bcrypt.compare(senha, funcionario.senha);

        if (senhaCorreta) {
            const { senha, ...dadosFuncionario } = funcionario;
            return dadosFuncionario;
        }
        return null;
    }

    public async listar() {
        return await prisma.funcionario.findMany({
            select: {
                id: true,
                nome: true,
                usuario: true,
                telefone: true,
                endereco: true,
                nivelPermissao: true,
            }
        });
    }

    public async removerFuncionario(id: number): Promise<void> {
        try {
            await prisma.funcionario.delete({
                where: { id: Number(id) }
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error("Funcionário não encontrado.");
            }
            if (error.code === 'P2003') {
                throw new Error("Impossível excluir. Funcionário vinculado a outros registros.");
            }
            throw new Error("Falha ao remover funcionário.");
        }
    }
}