import { Router } from "express";
import {clienteController} from "../controllers/cliente.controller";
const clienteRoutes = Router();

clienteRoutes.get('/', clienteController.listar);
clienteRoutes.post('/', clienteController.criar);
clienteRoutes.put('/', clienteController.atualizar);
clienteRoutes.delete('/:id', clienteController.excluir);

export default clienteRoutes;