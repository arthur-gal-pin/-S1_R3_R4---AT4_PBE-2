import { ResultSetHeader } from 'mysql2';
import { connection } from '../configs/Database';
import { Categoria } from '../models/Categoria';

const categoriaRepository = {
    create: async (categoria: Categoria): Promise<ResultSetHeader> => {
        const sql = 'INSERT INTO categorias (NomeCategoria, DescricaoCategoria) VALUES (?,?)';
        const values = [categoria.nome, categoria.descricao];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    read: async (pNome?: string, id?: number): Promise<Categoria[]> => {
        let sql = 'SELECT * FROM categorias WHERE 1=1';
        const values: any[] = [];

        if (id) {
            sql += ' AND IdCategoria = ?';
            values.push(id);
        }
        else if (pNome) {
            sql += ' AND NomeCategoria LIKE ?';
            values.push(`%${pNome}%`);
        }

        const [rows] = await connection.execute(sql, values);
        return rows as Categoria[];
    },
    update: async (categoria: Categoria): Promise<ResultSetHeader> => {
        const sql = 'UPDATE categorias SET NomeCategoria=?, DescricaoCategoria=? WHERE IdCategoria=?';
        const values = [categoria.nome, categoria.descricao, categoria.id];
        console.log(categoria);
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    delete: async (id: number): Promise<boolean> => {
        const sql = 'DELETE FROM categoria WHERE idCategoria = ?';
        const [result] = await connection.execute<ResultSetHeader>(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default categoriaRepository;