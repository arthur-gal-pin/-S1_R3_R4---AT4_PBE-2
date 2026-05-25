import { Router } from "express";
import pedidoController  from "../controllers/pedido.controller";

const pedidoRoutes = Router();
const itemRoutes = Router();

pedidoRoutes.get('/', pedidoController.listar);
pedidoRoutes.post('/', pedidoController.criar);
pedidoRoutes.put('/:id', pedidoController.atualizarStatus);
pedidoRoutes.delete('/:id', pedidoController.excluir);

itemRoutes.get('/', pedidoController.listar);
itemRoutes.post('/', pedidoController.criar);
itemRoutes.put('/:id', pedidoController.atualizarAdicao);
itemRoutes.delete('/:id', pedidoController.atualizarRemocao);


export {pedidoRoutes, itemRoutes};