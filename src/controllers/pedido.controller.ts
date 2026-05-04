import { Request, Response } from "express";
import { Pedidos } from "../models/Pedidos";
import { ItensPedido } from "../models/Itens_Pedido";
import { pedidoRepository } from "../repositories/pedidoRepository";
import { statusPedido } from "../enum/statusPedido";

const pedidoController = {
    criar: async (Req: Request, Res: Response) => {
        try {
            const { IdCliente, itens } = Req.body;

            if (!itens || !Array.isArray(itens)) {
                return Res.status(400).json({ message: 'A lista de itens é obrigatória.' });
            }

            const itens_pedido: ItensPedido[] = itens.map(item => {
                return ItensPedido.criar({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    valor: item.valor
                });
            });

            const subTotalItens = ItensPedido.calcularSubTotal(itens_pedido);

            const pedido = Pedidos.criar({
                clienteId: IdCliente,
                subTotal: subTotalItens,
                status: statusPedido.ABERTO
            });

            const result = await pedidoRepository.create(pedido, itens_pedido);

            return Res.status(201).json({
                message: 'Pedido criado com sucesso.',
                data: result
            });

        } catch (error: any) {
            console.error(error);
            return Res.status(500).json({
                message: 'Erro ao processar o pedido.',
                error: error.message
            });
        }
    },
    listar: async (Req: Request, Res: Response) => {
        try {
            const { idCliente, idPedido } = Req.query;
            if (isNaN(Number(idCliente)) && idCliente !== undefined || Number(idCliente) <= 0) {
                return Res.status(400).json({ message: 'Você deve inserir um numero maior do que zero para o IdCliente.' })
            } else if (isNaN(Number(idPedido)) && idPedido !== undefined || Number(idPedido) <= 0) {
                return Res.status(400).json({ message: 'Você deve inserir um numero maior que zero para o IdPedido.' })
            }

            const result = await pedidoRepository.read(Number(idCliente), Number(idPedido));

            if (result.length === 0) {
                return Res.status(200).json({ message: 'Nenhum registro encontrado.', data: [] });
            }

            return Res.status(200).json({ message: 'Requisição bem sucedida', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao listar pedidos.', error: error.message });
        }
    },
    atualizarStatus: async (Req: Request, Res: Response) => {
        try {
            const id = Number(Req.params.id);
            const status = (Req.query.status) as string;
            if (isNaN(id) || id <= 0 || id === undefined) {
                return Res.status(400).json({ message: 'Você deve inserir um numero maior que zero para o IdPedido.' });
            }
            if (!Object.values(statusPedido).includes(status as any)) {
                return Res.status(400).json({ message: `Status inválido. Valores permitidos: ${Object.values(statusPedido)}` });
            }
            const result = await pedidoRepository.updateStatus(status as statusPedido, id);
            return Res.status(200).json({ message: 'Requisição bem sucedida', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao atualizar pedidos.', error: error.message });
        }
    },
    atualizarRemocao: async (Req: Request, Res: Response) => {
        try {
            const idItem = Number(Req.params.idItem);

            if (isNaN(idItem) || idItem <= 0) {
                return Res.status(400).json({ message: 'ID do item inválido.' });
            }

            const itemParaRemover = await itensRepository.findById(idItem); // Assume-se que este método existe no seu itensRepository

            if (!itemParaRemover) {
                return Res.status(404).json({ message: 'Item não encontrado.' });
            }

            const pedidoInformacao = await pedidoRepository.read(undefined, itemParaRemover.pedidoId);
            const pedidoAnterior = pedidoInformacao[0];

            if (!pedidoAnterior) {
                return Res.status(404).json({ message: 'Pedido pai não encontrado.' });
            }

            const valorParaSubtrair = itemParaRemover.valor * itemParaRemover.quantidade;
            const novoSubTotal = Number(pedidoAnterior.SubTotal) - valorParaSubtrair;

            const pedidoAtualizado = Pedidos.editar({
                clienteId: pedidoAnterior.fk_IdCliente,
                subTotal: novoSubTotal < 0 ? 0 : novoSubTotal, // Garante que não fique negativo
                status: pedidoAnterior.Status
            }, itemParaRemover.pedidoId);

            const resultRemocao = await pedidoRepository.updateRemocao(idItem, pedidoAtualizado);

            return Res.status(200).json({
                message: 'Item removido e valor do pedido atualizado.',
                data: resultRemocao
            });

        } catch (error: any) {
            console.error(error);
            return Res.status(500).json({
                message: 'Erro ao remover item do pedido.',
                error: error.message
            });
        }
    },
    atualizarAdicao: async (Req: Request, Res: Response) => {
        try {
            const { item } = Req.body;

            const itemAdicao = new ItensPedido(
                null,
                item.pedidoId,
                item.produtoId,
                item.valor,
                item.quantidade
            );

            const pedidoInformacao = await pedidoRepository.read(undefined, itemAdicao.pedidoId);
            const pedidoAnterior = pedidoInformacao[0];

            if (!pedidoAnterior) {
                return Res.status(404).json({ message: 'Pedido não encontrado.' });
            }

            const novoSubTotal = Number(pedidoAnterior.SubTotal) + (itemAdicao.valor * itemAdicao.quantidade);

            const pedidoAtualizado = Pedidos.editar({
                clienteId: pedidoAnterior.fk_IdCliente,
                subTotal: novoSubTotal,
                status: pedidoAnterior.Status
            }, Number(item.pedidoId));

            const resultPedido = await pedidoRepository.updateAdicao(itemAdicao.pedidoId, pedidoAtualizado, itemAdicao);

            return Res.status(201).json({
                message: 'Item adicionado e pedido atualizado com sucesso!',
                data: resultPedido
            });

        } catch (error: any) {
            console.error(error);
            return Res.status(500).json({
                message: 'Erro ao adicionar item ao pedido.',
                error: error.message
            });
        }
    }
    ,
    excluir: async (Req: Request, Res: Response) => {
        try {
            const id = Number(Req.params.id);

            if (isNaN(id) || id <= 0 || id === undefined) {
                return Res.status(400).json({ message: 'Você deve inserir um numero maior que zero para o IdPedido.' });
            }
            const result = await pedidoRepository.delete(id);

            if (result) {
                return Res.status(404).json({ message: 'Pedido não encontrado para exclusão.' });
            }

            return Res.status(200).json({ message: 'Requisição bem sucedida', Colunas_Afetadas: result });

        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao excluir pedidos.', error: error.message });
        }
    },

};

export default pedidoController;