import { Request, Response } from "express";
import { AeronaveService } from "../services/aeronaveService";

const service = new AeronaveService();

export class AeronaveController {
    async cadastrar(req: Request, res: Response) {
        try {
            await service.cadastrar(req.body);
            return res.status(201).json({ message: "Aeronave cadastrada com sucesso!" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao cadastrar aeronave" });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const aeronaves = await service.listar();
            return res.json(aeronaves);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar aeronaves" });
        }
    }

    async buscarPorCodigo(req: Request, res: Response) {
        const { codigo } = req.params;
        try {
            const aeronave = await service.buscarPorCodigo(Number(codigo));
            
            if (!aeronave) return res.status(404).json({ error: "Aeronave não encontrada" });
            return res.json(aeronave);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar aeronave" });
        }
    }

    async atualizar(req: Request, res: Response) {
        const { codigo } = req.params;
        try {
            await service.atualizar(Number(codigo), req.body);
            return res.json({ message: "Aeronave atualizada!" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao atualizar aeronave" });
        }
    }

    async remover(req: Request, res: Response) {
        const { codigo } = req.params;
        try {
            await service.remover(Number(codigo));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao remover aeronave" });
        }
    }

    async gerarRelatorioData(req: Request, res: Response) {
        const { codigo } = req.params;
        try {
            const dados = await service.buscarPorCodigo(Number(codigo)); 
            if (!dados) return res.status(404).json({ error: "Aeronave não encontrada para relatório." });
            return res.json(dados);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao gerar dados do relatório." });
        }
    }
}