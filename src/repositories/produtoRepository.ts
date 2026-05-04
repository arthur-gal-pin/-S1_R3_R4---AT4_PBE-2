import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { connection } from '../configs/Database';
import { Produto } from '../models/Produto';

const produtoRepository = {
    create: async (produto: Produto): Promise<number> => {
        const sql = 'INSERT INTO produtos (NomeProduto, IdCategoria, Valor, CaminhoImagem) VALUES (?, ?, ?, ?)';
        const values = [produto.nome, produto.idCategoria, produto.valor, produto.vinculoImagem];
        const [result] = await connection.execute<ResultSetHeader>(sql, values);
        return result.insertId;
    },

    read: async (pNomeProduto?: string, id?: number): Promise<Produto[]> => {
        let sql = 'SELECT * FROM produtos WHERE 1=1';
        const values: any[] = [];

        if (id) {
            sql += ' AND IdProduto = ?';
            values.push(id);
        }
        if (pNomeProduto) {
            sql += ' AND NomeProduto LIKE ?';
            values.push(`%${pNomeProduto}%`);
        }

        const [rows] = await connection.execute<RowDataPacket[]>(sql, values);

        return rows.map(row => Produto.editar(
            row.IdProduto,
            {
                nome: row.NomeProduto,
                idCategoria: row.IdCategoria,
                valor: Number(row.Valor),
                vinculoImagem: row.CaminhoImagem
            }
        ));
    },

    update: async (produto: Produto): Promise<boolean> => {
        const sql = 'UPDATE produtos SET NomeProduto = ?, IdCategoria = ?, Valor = ? WHERE IdProduto = ?';
        const values = [produto.nome, produto.idCategoria, produto.valor, produto.idProduto];

        const [result] = await connection.execute<ResultSetHeader>(sql, values);
        return result.affectedRows > 0;
    },

    delete: async (id: number): Promise<boolean> => {
        const sql = 'DELETE FROM produtos WHERE IdProduto = ?';
        const [result] = await connection.execute<ResultSetHeader>(sql, [id]);
        return result.affectedRows > 0;
    }
};

export default produtoRepository;