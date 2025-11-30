import { StatusPeca } from '@prisma/client';
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
                    aeronaveId: Number(aeronaveCodigo)
                }
            });
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new Error("Aeronave vinculada não existe.");
            }
            throw new Error("Falha ao cadastrar peça.");
        }
    }

    public async listar() {
        return await prisma.peca.findMany({
            include: { aeronave: true } 
        });
    }

    public async atualizarStatus(idPeca: number, novoStatus: StatusPeca): Promise<void> { 
        const pecaExistente = await prisma.peca.findUnique({ where: { id: Number(idPeca) } });
        if (!pecaExistente) {
            throw new Error("Peça não encontrada.");
        }
        
        try {
            await prisma.peca.update({
                where: { id: Number(idPeca) },
                data: { status: novoStatus }
            });
        } catch (error) {
            throw new Error("Falha ao atualizar status.");
        }
    }
    
    public async excluirPeca(id: number): Promise<void> {
        try {
            await prisma.peca.delete({
                where: { id: Number(id) }
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error("Peça não encontrada. Verifique o ID.");
            }
            if (error.code === 'P2003') {
                throw new Error("Impossível excluir. A peça está vinculada a outro registro.");
            }
            throw new Error("Falha ao excluir peça."); 
        }
    }
}