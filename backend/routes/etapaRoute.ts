import { Router } from "express";
import { EtapaController } from "../controller/etapaController";

const router = Router();
const controller = new EtapaController();

router.post("/", controller.cadastrar);
router.get("/aeronave/:codigo", controller.listarPorAeronave);
router.patch("/:id/iniciar", controller.iniciar);
router.patch("/:id/finalizar", controller.finalizar);
router.post("/:id/associar", controller.associarFuncionario); 
router.delete("/:id", controller.excluir);

export { router as etapaRoutes };