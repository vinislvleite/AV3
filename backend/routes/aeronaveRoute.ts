import { Router } from "express";
import { AeronaveController } from "../controller/aeronaveController";

const router = Router();
const controller = new AeronaveController();

router.post("/", controller.cadastrar);
router.get("/", controller.listar);
router.get("/:codigo", controller.buscarPorCodigo);
router.put("/:codigo", controller.atualizar);
router.delete("/:codigo", controller.remover);

export { router as aeronaveRoutes };