import { Request, Response } from "express";
import produtoRepository from "../repositories/produtoRepository";
import { Produto } from "../models/Produto";


const produtoController = {
    criar: async (Req: Request, Res: Response) => {
        const idCategoria: Number = Req.body.idCategoria;
        const valor: Number = Req.body.valor;
        const nomeProduto: string = Req.body.nomeProduto;

        console.log(nomeProduto);
        console.log(valor);

        if (!Req.file) {
            return Res.status(400).json({
                message: 'Arquivo de imagem não enviado.'
            });
        }

        const caminhoImagem: string = `src/uploads/images/${Req.file.filename}`;
        const produto = Produto.criar({
            nome: String(nomeProduto),
            idCategoria: Number(idCategoria),
            valor: Number(valor),
            vinculoImagem: caminhoImagem // O Factory espera 'vinculoImagem'
        });
        console.log(produto.valor);

        const result = await produtoRepository.create(produto);


        return Res.status(201).json({
            message: 'Registro inserido com sucesso.',
            produto: result,
            file: {
                filename: Req.file.filename,
                size: Req.file.size,
                mimetype: Req.file.mimetype,
            }
        });
    },
    atualizar: async (Req: Request, Res: Response) => {
        console.log(Req.body);
        try {
            const id = Number(Req.params.id);
            
            const produtosEncontrados = await produtoRepository.read(undefined, id);
            const antigo = produtosEncontrados[0];

            if (!antigo) {
                return Res.status(404).json({ message: 'Produto não encontrado.' });
            }

            const { nomeProduto, idCategoria, valor } = Req.body;

            const dadosAtualizados = {
                nome: nomeProduto || antigo.nome,
                idCategoria: idCategoria ? Number(idCategoria) : antigo.idCategoria,
                valor: valor ? Number(valor) : antigo.valor,
                vinculoImagem: antigo.vinculoImagem
            };

            const produtoInstance = Produto.editar(id, dadosAtualizados);

            const sucesso = await produtoRepository.update(produtoInstance);

            if (sucesso === true) {
                return Res.status(200).json({
                    message: 'Produto atualizado com sucesso!',
                    produto: {
                        id: produtoInstance.idProduto,
                        nome: produtoInstance.nome,
                        valor: produtoInstance.valor
                    }
                });
            }

        } catch (error: any) {
            return Res.status(400).json({ message: error.message });
        }
    },
    excluir: async (Req: Request, Res: Response) => {
        try {
            const id: number = Number(Req.params.id);
            const result = await produtoRepository.delete(id);
            return Res.status(200).json({ "message": "Você excluiu o produto com sucesso.", "data": result });

        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    },
    listar: async (req: Request, res: Response) => {
        try {
            const { nome, id } = req.body;

            const result = await produtoRepository.read(nome, id);

            if (result.length === 0) {
                const contexto = id ? `com o id ${id}` : (nome ? `com o nome "${nome}"` : 'cadastrado');
                return res.status(200).json({
                    message: `Não há nenhum produto ${contexto} no banco de dados.`
                });
            }

            if (result.length == 0) {
                return res.status(200).json({ message: 'Não há nenhum produto com essa descrição.' })
            }

            res.status(200).json({ message: 'Requisição bem sucedida', data: result });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    }
}

export default produtoController;