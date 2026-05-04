import { Router } from "express";
import { telefoneController } from "../controllers/cliente.controller";
const telefoneRoutes = Router();

telefoneRoutes.get('/', telefoneController.listar);
telefoneRoutes.post('/', telefoneController.criar);
telefoneRoutes.put('/', telefoneController.atualizar);
telefoneRoutes.delete('/:id', telefoneController.excluir);

export default telefoneRoutes;