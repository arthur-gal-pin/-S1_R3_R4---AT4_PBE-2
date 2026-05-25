import {Router} from 'express';
const routes = Router();
import categoriaRoutes from './categoriaRoutes';
import produtoRoutes from './produtoRoutes';
import clienteRoutes from './clienteRoutes';
import telefoneRoutes from './telefoneRoutes';
import enderecoRoutes from './enderecoRoutes';
import {pedidoRoutes} from './pedidoRoutes';

routes.use('/categorias', categoriaRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/enderecos', enderecoRoutes);
routes.use('/telefones', telefoneRoutes);
routes.use('/pedidos', pedidoRoutes);

export default routes;