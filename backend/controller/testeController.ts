import { Request, Response } from "express";
import { TesteService } from "../services/testeService";

const service = new TesteService();

export class TesteController {
    async cadastrar(req: Request, res: Response) {
        const { aeronaveCodigo, ...dadosTeste } = req.body;
        
        try {
            await service.cadastrar(dadosTeste, aeronaveCodigo);
            return res.status(201).json({ message: "Teste registrado com sucesso!" });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao registrar teste" });
        }
    }

    async listar(req: Request, res: Response) {
        const testes = await service.listar();
        return res.json(testes);
    }
}