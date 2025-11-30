import { Request, Response } from "express";
import { PecaService } from "../services/pecaService";
// IMPORTANTE: Adicione a importação do tipo StatusPeca (se não estiver já em services/pecaService)
import { StatusPeca } from '@prisma/client'; 

const service = new PecaService();

// Função auxiliar para mapear a string do body para a constante Enum
const mapStatusToEnumKey = (status: string): StatusPeca => {
    switch (status) {
        case 'em producao': return 'EM_PRODUCAO' as StatusPeca;
        case 'em transporte': return 'EM_TRANSPORTE' as StatusPeca;
        case 'pronta para uso': return 'PRONTA' as StatusPeca;
        default: throw new Error("Valor de status inválido. Use 'em producao', 'em transporte' ou 'pronta para uso'.");
    }
};

export class PecaController {
    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, ...dadosPeca } = req.body;
        
        if (!aeronaveCodigo) {
            return res.status(400).json({ error: "O código da aeronave é obrigatório." });
        }
        
        try {
            // Aqui o Service espera dadosPeca.status como string (ex: 'EM_PRODUCAO')
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
            // CORREÇÃO AQUI: Mapeia a string recebida (ex: 'em producao') para o tipo Enum (StatusPeca.EM_PRODUCAO)
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