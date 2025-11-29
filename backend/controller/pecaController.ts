import { Request, Response } from "express";
import { PecaService } from "../services/pecaService";

const service = new PecaService();

export class PecaController {
    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, ...dadosPeca } = req.body;
        
        try {
            // CONVERSÃO: aeronaveCodigo precisa ser número
            await service.cadastrar(dadosPeca, Number(aeronaveCodigo));
            return res.status(201).json({ message: "Peça cadastrada!" });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao cadastrar peça" });
        }
    }

    async listar(req: Request, res: Response) {
        const pecas = await service.listar();
        return res.json(pecas);
    }

    async atualizarStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body; 
        
        try {
            // CONVERSÃO: ID da peça agora é número
            await service.atualizarStatus(Number(id), status);
            return res.json({ message: "Status atualizado com sucesso" });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao atualizar status" });
        }
    }
}