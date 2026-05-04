import { Router } from "express";
import produtoController from "../controllers/produto.controller";
import uploadImage from "../middlewares/uploadImage.middleware";

const produtoRoutes = Router();

produtoRoutes.get('/', produtoController.listar);
produtoRoutes.post('/', uploadImage, produtoController.criar);
produtoRoutes.put('/:id', produtoController.atualizar);
produtoRoutes.delete('/:id', produtoController.excluir);

export default produtoRoutes;