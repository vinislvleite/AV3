import { prisma } from "../db";

interface IEtapaDTO {
    nome: string;
    prazoConclusao: string | Date;
}

export class EtapaService {

    async cadastrarEtapa(dados: IEtapaDTO, aeronaveCodigo: number, funcionariosIds?: number[]): Promise<void> {
        const criarRelacoes = funcionariosIds && funcionariosIds.length > 0
            ? {
                create: funcionariosIds.map(id => ({
                    funcionarioId: id
                }))
              }
            : undefined;

        await prisma.etapaProducao.create({
            data: {
                nome: dados.nome,
                prazoConclusao: new Date(dados.prazoConclusao),
                status: 0,
                aeronaveId: aeronaveCodigo,
                funcionarios: criarRelacoes
            }
        });
    }

    async listarEtapasAeronave(aeronaveCodigo: number) {
        return prisma.etapaProducao.findMany({
            where: { aeronaveId: aeronaveCodigo },
            include: {
                funcionarios: {
                    include: { funcionario: true }
                }
            }
        });
    }

    async iniciarEtapaValidacao(idEtapa: number): Promise<void> {
        const etapa = await prisma.etapaProducao.findUnique({ where: { id: idEtapa } });
        if (!etapa) throw new Error("Etapa não encontrada");

        await prisma.etapaProducao.update({
            where: { id: idEtapa },
            data: { status: 1 }
        });
    }

    async finalizarEtapaValidacao(idEtapa: number): Promise<void> {
        const etapa = await prisma.etapaProducao.findUnique({ where: { id: idEtapa } });
        if (!etapa) throw new Error("Etapa não encontrada");

        await prisma.etapaProducao.update({
            where: { id: idEtapa },
            data: { status: 2 }
        });
    }

    async associarMultiplosFuncionarios(idEtapa: number, funcionariosIds: number[]): Promise<boolean> {
        const etapa = await prisma.etapaProducao.findUnique({
            where: { id: idEtapa },
            include: { funcionarios: true }
        });

        if (!etapa) return false;

        const jaAssociados = etapa.funcionarios.map(f => f.funcionarioId);
        const novos = funcionariosIds.filter(id => !jaAssociados.includes(id));

        if (novos.length === 0) return true;

        try {
            await prisma.etapaProducao.update({
                where: { id: idEtapa },
                data: {
                    funcionarios: {
                        create: novos.map(id => ({ funcionarioId: id }))
                    }
                }
            });
            return true;
        } catch (error) {
            console.error("Erro ao tentar associar funcionários:", error); 
            return false;
        }
    }
    
    async excluirEtapa(idEtapa: number): Promise<void> {
        const etapa = await prisma.etapaProducao.findUnique({ where: { id: idEtapa } });
        if (!etapa) {
            throw new Error("Etapa não encontrada");
        }
        await prisma.etapaProducao.delete({ where: { id: idEtapa } });
    }
}