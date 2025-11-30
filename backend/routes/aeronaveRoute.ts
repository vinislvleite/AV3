import { Router } from "express";
import { AeronaveController } from "../controller/aeronaveController";

const router = Router();
const controller = new AeronaveController();

router.post("/", controller.cadastrar);
router.get("/", controller.listar);
router.get("/:codigo", controller.buscarPorCodigo);
router.put("/:codigo", controller.atualizar);
router.delete("/:codigo", controller.remover);
router.get("/:codigo/relatorio", controller.gerarRelatorioData);
export { router as aeronaveRoutes };