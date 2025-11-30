import { Request, Response } from "express";
import { EtapaService } from "../services/etapaService";

const service = new EtapaService();

export class EtapaController {

    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, funcionariosIds, ...dadosEtapa } = req.body;

        if (!aeronaveCodigo) {
            return res.status(400).json({ error: "O código da aeronave é obrigatório." });
        }

        try {
            await service.cadastrarEtapa(dadosEtapa, Number(aeronaveCodigo), funcionariosIds);
            return res.status(201).json({ message: "Etapa criada com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ error: "Erro ao cadastrar etapa.", details: error.message });
        }
    }

    async listarPorAeronave(req: Request, res: Response) {
        const { codigo } = req.params;
        try {
            const etapas = await service.listarEtapasAeronave(Number(codigo));
            return res.status(200).json(etapas);
        } catch (error: any) {
            return res.status(500).json({ error: "Erro ao listar etapas.", details: error.message });
        }
    }

    async iniciar(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await service.iniciarEtapaValidacao(Number(id));
            return res.status(200).json({ message: "Etapa iniciada com sucesso." });
        } catch (error: any) {
            if (error.message.includes("não encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: "Erro ao iniciar etapa.", details: error.message });
        }
    }

    async finalizar(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await service.finalizarEtapaValidacao(Number(id));
            return res.status(200).json({ message: "Etapa finalizada com sucesso." });
        } catch (error: any) {
            if (error.message.includes("não encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: "Erro ao finalizar etapa.", details: error.message });
        }
    }

    async associarFuncionario(req: Request, res: Response) {
        const { id } = req.params;
        const { funcionariosIds } = req.body;

        if (!funcionariosIds || !Array.isArray(funcionariosIds) || funcionariosIds.length === 0) {
            return res.status(400).json({ error: "É necessário fornecer uma lista de 'funcionariosIds'." });
        }

        try {
            const sucesso = await service.associarMultiplosFuncionarios(Number(id), funcionariosIds);
            if (!sucesso) {
                return res.status(404).json({ error: "Etapa não encontrada." });
            }
            return res.status(200).json({ message: "Funcionários associados com sucesso." });
        } catch (error: any) {
            if (error.code === 'P2003') { 
                 return res.status(400).json({ error: "Um ou mais IDs de funcionários são inválidos ou não existem." });
            }
            return res.status(500).json({ error: "Erro ao associar funcionários.", details: error.message });
        }
    }
    
    async excluir(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await service.excluirEtapa(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            if (error.message.includes("não encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro ao excluir etapa.", details: error.message });
        }
    }
}