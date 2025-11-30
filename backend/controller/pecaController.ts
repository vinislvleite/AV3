import { Request, Response } from "express";
import { PecaService } from "../services/pecaService";
import { StatusPeca } from '@prisma/client'; 

const service = new PecaService();

const mapStatusToEnumKey = (status: string): StatusPeca => {
    const statusUpper = status.toUpperCase();

    switch (statusUpper) {
        case 'EM PRODUCAO': 
        case 'EM_PRODUCAO': 
            return 'EM_PRODUCAO' as StatusPeca;
            
        case 'EM TRANSPORTE': 
        case 'EM_TRANSPORTE': 
            return 'EM_TRANSPORTE' as StatusPeca;
            
        case 'PRONTA PARA USO': 
        case 'PRONTA': 
            return 'PRONTA' as StatusPeca;
            
        default: 
            throw new Error(`Valor de status inválido: ${status}`);
    }
};

export class PecaController {
    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, ...dadosPeca } = req.body;
        
        if (!aeronaveCodigo) {
            return res.status(400).json({ error: "O código da aeronave é obrigatório." });
        }
        
        try {
            await service.cadastrar(dadosPeca, Number(aeronaveCodigo));
            return res.status(201).json({ message: "Peça cadastrada!" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao cadastrar peça" });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const pecas = await service.listar();
            return res.json(pecas);
        } catch (error) {
             return res.status(500).json({ error: "Erro ao listar peças." });
        }
    }

    async atualizarStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body; 
        
        if (!status) {
            return res.status(400).json({ error: "O novo status é obrigatório." });
        }
        
        try {
            const novoStatusEnum = mapStatusToEnumKey(status);
            
            await service.atualizarStatus(Number(id), novoStatusEnum);
            return res.json({ message: "Status atualizado com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao atualizar status." });
        }
    }
    
    async excluir(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await service.excluirPeca(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao excluir peça." });
        }
    }
}