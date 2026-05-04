import { Router } from "express";
import { enderecoController } from "../controllers/cliente.controller";
const enderecoRoutes = Router();

enderecoRoutes.get('/', enderecoController.listar);
enderecoRoutes.post('/', enderecoController.criar);
enderecoRoutes.put('/', enderecoController.atualizar);
enderecoRoutes.delete('/:id', enderecoController.excluir);

export default enderecoRoutes;