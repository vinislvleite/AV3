import { prisma } from "../db";

export class PecaService {

    public async cadastrar(dados: any, aeronaveCodigo: number): Promise<void> {
        try {
            await prisma.peca.create({
                data: {
                    nome: dados.nome,
                    fornecedor: dados.fornecedor,
                    tipo: dados.tipo,
                    status: dados.status,
                    aeronaveId: aeronaveCodigo
                }
            });
            console.log("Peça cadastrada!");
        } catch (error) {
            console.error("Erro ao cadastrar peça:", error);
        }
    }

    public async listar() {
        return await prisma.peca.findMany({
            include: { aeronave: true } 
        });
    }

    public async buscarPorNome(nome: string) {
        return await prisma.peca.findFirst({
            where: { nome }
        });
    }

    public async atualizarStatus(idPeca: number, novoStatus: any): Promise<void> { 
        try {
            await prisma.peca.update({
                where: { id: idPeca },
                data: { status: novoStatus }
            });
            console.log("Status atualizado!");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    }
}