import { Request, Response } from "express";
import { FuncionarioService } from "../services/funcionarioService";

const service = new FuncionarioService();

export class FuncionarioController {
    
    async login(req: Request, res: Response) {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
        }
        
        try {
            const funcionario = await service.autenticar(usuario, senha); 
            
            if (!funcionario) {
                return res.status(401).json({ error: "Usuário ou senha inválidos." });
            }
            
            return res.json(funcionario);
            
        } catch (error) {
            console.error("Erro no processo de login:", error);
            return res.status(500).json({ error: "Erro no servidor durante a autenticação." });
        }
    }
    
    async cadastrar(req: Request, res: Response) {
        try {
            await service.cadastrar(req.body);
            return res.status(201).json({ message: "Funcionário cadastrado!" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao cadastrar funcionário." });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const funcionarios = await service.listar();
            return res.json(funcionarios);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar funcionários." });
        }
    }

    async remover(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await service.removerFuncionario(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao remover funcionário." });
        }
    }
}