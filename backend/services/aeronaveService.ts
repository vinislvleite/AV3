import { prisma } from "../db";

export class AeronaveService {
    
    public async cadastrar(dados: any): Promise<void> {
        try {
            await prisma.aeronave.create({
                data: {
                    codigo: Number(dados.codigo), // Garante que vira número
                    modelo: dados.modelo,
                    tipo: dados.tipo,
                    capacidade: Number(dados.capacidade),
                    alcance: Number(dados.alcance),
                    cliente: dados.cliente,
                    dataEntrega: dados.dataEntrega
                }
            });
            console.log("Aeronave cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar aeronave:", error);
            throw new Error("Erro ao cadastrar aeronave");
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
        try {
            await prisma.aeronave.delete({
                where: { codigo }
            });
            console.log(`Aeronave ${codigo} removida!`);
        } catch (error) {
            console.error(`Erro ao remover aeronave:`, error);
        }
    }

    public async atualizar(codigo: number, dados: any): Promise<void> {
        try {
            await prisma.aeronave.update({
                where: { codigo },
                data: dados
            });
            console.log(`Aeronave ${codigo} atualizada!`);
        } catch (error) {
            console.error(`Erro ao atualizar aeronave:`, error);
        }
    }
}