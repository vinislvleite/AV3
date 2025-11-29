import { Request, Response } from "express";
import { EtapaService } from "../services/etapaService";

const service = new EtapaService();

export class EtapaController {
    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, ...dadosEtapa } = req.body;
        
        try {
            // CONVERSÃO: aeronaveCodigo para número
            await service.cadastrarEtapa(dadosEtapa, Number(aeronaveCodigo));
            return res.status(201).json({ message: "Etapa criada com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar etapa" });
        }
    }

    async listarPorAeronave(req: Request, res: Response) {
        const { codigo } = req.params;
        // CONVERSÃO: código da aeronave
        const etapas = await service.listarEtapasAeronave(Number(codigo));
        return res.json(etapas);
    }

    async iniciar(req: Request, res: Response) {
        const { id } = req.params;
        try {
            // CONVERSÃO: ID da etapa
            await service.iniciarEtapaValidacao(Number(id));
            return res.json({ message: "Etapa iniciada" });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao iniciar etapa" });
        }
    }

    async finalizar(req: Request, res: Response) {
        const { id } = req.params;
        try {
            // CONVERSÃO: ID da etapa
            await service.finalizarEtapaValidacao(Number(id));
            return res.json({ message: "Etapa finalizada" });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao finalizar etapa" });
        }
    }

    async associarFuncionario(req: Request, res: Response) {
        const { id } = req.params; 
        const { funcionarioId } = req.body;
        
        // CONVERSÃO: ID da etapa e ID do funcionário
        const sucesso = await service.associarFuncionario(Number(id), Number(funcionarioId));
        
        if (sucesso) {
            return res.json({ message: "Funcionário associado com sucesso!" });
        } else {
            return res.status(400).json({ error: "Erro ao associar funcionário" });
        }
    }
}