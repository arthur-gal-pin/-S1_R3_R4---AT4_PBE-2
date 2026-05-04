import { Categoria } from "../models/Categoria";
import categoriaRepository from "../repositories/categoriaRepository";
import { Request, Response } from "express";


const categoriaController = {
    criar: async (Req: Request, Res: Response) => {
        try {
            const { nome, descricao } = Req.body;
            const categoria = Categoria.criar({ nome, descricao });
            const result = await categoriaRepository.create(categoria);
            return Res.status(201).json({ result });
        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    },
    atualizar: async (Req: Request, Res: Response) => {
        try {
            const id: number = Number(Req.query.id);
            const { nome, descricao } = Req.body;
            const categoria = Categoria.editar(id, { nome, descricao });
            const result = await categoriaRepository.update(categoria);
            return Res.status(200).json({ result });

        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    },
    excluir: async (Req: Request, Res: Response) => {
        try {
            const id: number = Number(Req.params.id);
            const result = await categoriaRepository.delete(id);
            return Res.status(200).json({ result });
        } catch (error: any) {
            console.error(error);
            Res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    },
    listar: async (req: Request, res: Response) => {
        try {
            const { nome, id } = req.body;

            const result = await categoriaRepository.read(nome, id);

            if (result.length === 0) {
                const contexto = id ? `com o id ${id}` : (nome ? `com o nome "${nome}"` : 'cadastrada');
                return res.status(200).json({
                    message: `Não há nenhuma categoria ${contexto} no banco de dados.`
                });
            }

            if (result.length == 0) {
                return res.status(200).json({ message: 'Não há nenhuma categoria com essa descrição.' })
            }

            res.status(200).json({ message: 'Requisição bem sucedida', data: result });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message })
        }
    }
}

export default categoriaController;