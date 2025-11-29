import { Router } from "express";
import { FuncionarioController } from "../controller/funcionarioController";

const router = Router();
const controller = new FuncionarioController();

router.post("/", controller.cadastrar);
router.get("/", controller.listar);
router.post("/login", controller.login);

export { router as funcionarioRoutes };