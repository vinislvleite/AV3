import { prisma } from "../db";

export class TesteService {

    public async cadastrar(dados: any, aeronaveCodigo: number): Promise<void> {
        await prisma.teste.create({
            data: {
                tipo: dados.tipo,
                resultado: dados.resultado,
                aeronaveId: aeronaveCodigo
            }
        });
        console.log("Teste cadastrado!");
    }

    public async listar() {
        return await prisma.teste.findMany({
            include: { aeronave: true }
        });
    }
}