import { Router } from "express";
import pedidoController  from "../controllers/pedido.controller";

const pedidoRoutes = Router();
const itemRoutes = Router();

pedidoRoutes.get('/', pedidoController.listar);
pedidoRoutes.post('/', pedidoController.criar);
pedidoRoutes.put('/:id', pedidoController.atualizarStatus);
pedidoRoutes.delete('/:id', pedidoController.excluir);

itemRoutes.get('/', itemController.listar);
itemRoutes.post('/', itemController.criar);
itemRoutes.put('/:id', itemController.atualizar);
itemRoutes.delete('/:id', itemController.excluir);


export {pedidoRoutes, itemRoutes};