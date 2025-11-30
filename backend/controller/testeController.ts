import { Request, Response } from "express";
import { TesteService } from "../services/testeService";
import { TipoTeste, ResultadoTeste } from "@prisma/client";

const service = new TesteService();

const mapTipoTeste = (tipo: string): TipoTeste => {
    switch (tipo.toUpperCase()) {
        case 'ELETRICO': return 'ELETRICO' as TipoTeste;
        case 'HIDRAULICO': return 'HIDRAULICO' as TipoTeste;
        case 'AERODINAMICO': return 'AERODINAMICO' as TipoTeste;
        default: throw new Error("Tipo de teste inválido.");
    }
};

const mapResultadoTeste = (resultado: string): ResultadoTeste => {
    switch (resultado.toUpperCase()) {
        case 'APROVADO': return 'APROVADO' as ResultadoTeste;
        case 'REPROVADO': return 'REPROVADO' as ResultadoTeste;
        default: throw new Error("Resultado de teste inválido.");
    }
};


export class TesteController {
    
    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, nome, tipo, resultado } = req.body;
        
        if (!nome || typeof nome !== 'string' || nome.trim() === '') {
            return res.status(400).json({ error: "O nome do teste é obrigatório." });
        }
        if (!aeronaveCodigo) {
            return res.status(400).json({ error: "A aeronave vinculada é obrigatória." });
        }

        try {
            const tipoEnum = mapTipoTeste(tipo);
            const resultadoEnum = mapResultadoTeste(resultado);

            await service.cadastrarTeste({ nome: nome.trim(), tipo: tipoEnum, resultado: resultadoEnum }, Number(aeronaveCodigo));
            return res.status(201).json({ message: "Teste cadastrado com sucesso!" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao cadastrar teste" });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const testes = await service.listarTestes();
            return res.json(testes);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar testes." });
        }
    }

    async excluir(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await service.excluirTeste(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            if (error.message.includes("não encontrado")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message || "Erro ao excluir teste." });
        }
    }
}