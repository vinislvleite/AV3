import { prisma } from "../db";

export class EtapaService {

    public async cadastrarEtapa(dados: any, aeronaveCodigo: number): Promise<void> {
        try {
            await prisma.etapaProducao.create({
                data: {
                    nome: dados.nome,
                    prazoConclusao: new Date(dados.prazoConclusao),
                    status: 0,
                    aeronaveId: aeronaveCodigo
                }
            });
            console.log("Etapa cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar etapa:", error);
            throw new Error("Erro ao cadastrar etapa");
        }
    }

    public async listarEtapasAeronave(aeronaveCodigo: number) {
        return await prisma.etapaProducao.findMany({
            where: { aeronaveId: aeronaveCodigo },
            include: { funcionarios: true }
        });
    }

    public async iniciarEtapaValidacao(idEtapa: number): Promise<void> {
        const etapa = await prisma.etapaProducao.findUnique({
            where: { id: idEtapa }
        });

        if (!etapa) {
            console.log("Etapa não encontrada");
            return;
        }

        await prisma.etapaProducao.update({
            where: { id: idEtapa },
            data: { status: 1 }
        });
        console.log(`A etapa "${etapa.nome}" foi iniciada.`);
    }

    public async finalizarEtapaValidacao(idEtapa: number): Promise<void> {
        const etapa = await prisma.etapaProducao.findUnique({
            where: { id: idEtapa }
        });
        
        if (etapa) {
            await prisma.etapaProducao.update({
                where: { id: idEtapa },
                data: { status: 2 }
            });
            console.log(`A etapa "${etapa.nome}" foi finalizada.`);
        } else {
            console.log("Etapa não encontrada");
        }
    }

    public async associarFuncionario(idEtapa: number, idFuncionario: number): Promise<boolean> {
        const etapa = await prisma.etapaProducao.findUnique({
            where: { id: idEtapa },
            include: { funcionarios: true }
        });
        
        if (!etapa) {
            console.log("Etapa não encontrada");
            return false;
        }

        const jaExiste = etapa.funcionarios.some(f => f.id === idFuncionario);
        if (jaExiste) {
            console.log("Funcionário já está nesta etapa.");
            return false;
        }

        try {
            await prisma.etapaProducao.update({
                where: { id: idEtapa },
                data: {
                    funcionarios: {
                        connect: { id: idFuncionario }
                    }
                }
            });
            console.log(`Funcionario associado à etapa "${etapa.nome}".`);
            return true;
        } catch (error) {
            console.error("Erro ao associar funcionário:", error);
            return false;
        }
    }

    public async listarFuncionariosEtapa(idEtapa: number): Promise<void> {
        const etapa = await prisma.etapaProducao.findUnique({
            where: { id: idEtapa },
            include: { funcionarios: true }
        });
        
        if (etapa) {
            if (etapa.funcionarios.length === 0) {
                console.log("Nenhum funcionário associado a esta etapa.");
            } else {
                etapa.funcionarios.forEach(f => console.log(`${f.nome} - ${f.nivelPermissao}`));
            }
        } else {
            console.log("Etapa não encontrada");
        }
    }
}