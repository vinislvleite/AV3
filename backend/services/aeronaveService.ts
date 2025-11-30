import { prisma } from "../db";

export class AeronaveService {
    
    public async cadastrar(dados: any): Promise<void> {
        try {
            await prisma.aeronave.create({
                data: {
                    codigo: Number(dados.codigo), 
                    modelo: dados.modelo,
                    tipo: dados.tipo,
                    capacidade: Number(dados.capacidade),
                    alcance: Number(dados.alcance),
                    cliente: dados.cliente,
                    dataEntrega: dados.dataEntrega
                }
            });
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('codigo')) {
                throw new Error(`O código ${dados.codigo} já está em uso.`);
            }
            throw new Error("Falha ao cadastrar aeronave no banco.");
        }
    }

    public async listar() {
        return await prisma.aeronave.findMany({
            include: { 
                pecas: true, 
                etapas: true, 
                testes: true 
            } 
        });
    }

    public async buscarPorCodigo(codigo: number) {
        return await prisma.aeronave.findUnique({
            where: { codigo },
            include: { 
                pecas: true, 
                etapas: true, 
                testes: true 
            }
        });
    }

    public async remover(codigo: number): Promise<void> {
        const aeronave = await prisma.aeronave.findUnique({ where: { codigo } });
        if (!aeronave) throw new Error("Aeronave não encontrada.");

        try {
            await prisma.aeronave.delete({
                where: { codigo }
            });
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new Error("Não é possível remover a aeronave. Existem peças ou etapas de produção vinculadas.");
            }
            throw new Error("Erro ao remover aeronave.");
        }
    }

    public async atualizar(codigo: number, dados: any): Promise<void> {
        const { codigo: _, ...dadosParaAtualizar } = dados; 
        
        try {
            await prisma.aeronave.update({
                where: { codigo },
                data: dadosParaAtualizar
            });
        } catch (error) {
            throw new Error("Erro ao atualizar aeronave.");
        }
    }
}