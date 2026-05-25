import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { connection } from '../configs/Database';
import { Categoria } from '../models/Categoria';

const categoriaRepository = {
    create: async (categoria: Categoria): Promise<ResultSetHeader> => {
        const sql = 'INSERT INTO categorias (NomeCategoria, DescricaoCategoria) VALUES (?,?)';
        const values = [categoria.nome, categoria.descricao];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },
    read: async (
        pNome?: string | undefined,
        id?: number | undefined
    ): Promise<Categoria[]> => {

        let sql = `
        SELECT *
        FROM categorias
        WHERE 1=1
    `;

        const values: any[] = [];

        // Filtro por ID
        if (id !== undefined && id > 0) {
            sql += ' AND IdCategoria = ?';
            values.push(id);
        }

        // Filtro por nome
        if (pNome && pNome.trim() !== '') {
            sql += ' AND NomeCategoria LIKE ?';
            values.push(`%${pNome.trim()}%`);
        }

        console.log('SQL:', sql);
        console.log('VALUES:', values);

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
        const sql = 'DELETE FROM categorias WHERE idCategoria = ?';
        const [result] = await connection.execute<ResultSetHeader>(sql, [id]);
        return result.affectedRows > 0;
    },
    readAll: async(): Promise<Categoria[]> => {
        const sql = 'SELECT * FROM categorias';
        const [result] = await connection.execute<RowDataPacket[]>(sql);
        console.log(result)
        return result as Categoria[];
    }
}

export default categoriaRepository;