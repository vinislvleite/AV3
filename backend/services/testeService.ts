import { TipoTeste, ResultadoTeste } from "@prisma/client";
import { prisma } from "../db"; 

// Definindo a interface de dados para o service
interface TesteDados {
    nome: string;
    tipo: TipoTeste;
    resultado: ResultadoTeste;
}

export class TesteService {

    public async cadastrarTeste(dados: TesteDados, aeronaveCodigo: number): Promise<void> {
        // A falha ocorre aqui. Vamos garantir que o objeto 'data' seja construído com tipos conhecidos.
        const dadosParaCriar = {
            nome: dados.nome,
            tipo: dados.tipo,
            resultado: dados.resultado,
            aeronaveId: Number(aeronaveCodigo)
        };

        try {
            // Usamos o objeto de dados explicitamente construído
            await prisma.teste.create({
                data: dadosParaCriar,
            });
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new Error("Aeronave vinculada não existe.");
            }
            throw new Error("Falha ao cadastrar teste.");
        }
    }

    public async listarTestes() {
        return await prisma.teste.findMany({
            include: { aeronave: true }
        });
    }

    public async excluirTeste(id: number): Promise<void> {
        try {
            await prisma.teste.delete({
                where: { id: Number(id) }
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error("Teste não encontrado.");
            }
            throw new Error("Falha ao excluir teste.");
        }
    }

    public async listarTiposTestes(): Promise<string[]> {
        return Object.values(TipoTeste) as string[];
    }

    public async listarResultadosTestes(): Promise<string[]> {
        return Object.values(ResultadoTeste) as string[];
    }
}