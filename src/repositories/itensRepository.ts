import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { connection } from '../configs/Database';
import { ItensPedido } from '../models/Itens_Pedido';

export const itensRepository = {
    criarItem: async (idPedido: number, itensPedido: ItensPedido[]) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sqlItemPed = `
            INSERT INTO itens_pedido (fk_IdPedido, fk_IdProduto, Quantidade, Valor) 
            VALUES (?, ?, ?, ?);
        `;

            for (const item of itensPedido) {
                const valuesItemPed = [
                    idPedido,
                    item.produtoId,
                    item.quantidade,
                    item.valor,
                ];
                await conn.execute(sqlItemPed, valuesItemPed);
            }

            const sqlSoma = `
            SELECT SUM(Quantidade * Valor) as novoSubTotal 
            FROM itens_pedido 
            WHERE fk_IdPedido = ?;
        `;

            const [rowsSoma]: any = await conn.execute(sqlSoma, [idPedido]);
            const novoSubTotal = rowsSoma[0].novoSubTotal || 0;

            const sqlUpdatePedido = "UPDATE pedidos SET SubTotal = ? WHERE IdPedido = ?;";
            await conn.execute(sqlUpdatePedido, [novoSubTotal, idPedido]);

            await conn.commit();

            return {
                idPedido,
                novoSubTotal,
            };
        } catch (error) {
            await conn.rollback();
            console.error("Erro ao adicionar itens:", error);
            throw error;
        } finally {
            conn.release();
        }
    },

    read: async (idPedido: number): Promise<ItensPedido[]> => {
        const sql = 'SELECT * FROM itens_pedido WHERE fk_IdPedido = ?';
        const [rows] = await connection.execute<RowDataPacket[]>(sql, [idPedido]);

        return rows.map(row => new ItensPedido(
            row.IdItens_Pedido,
            row.fk_IdPedido,
            row.fk_IdProduto,
            row.Valor,
            row.Quantidade
        ));
    },

    update: async (item: ItensPedido): Promise<boolean> => {
        const sql = `
            UPDATE itens_pedido 
            SET Quantidade = ?, Valor = ?
            WHERE IdItens_Pedido = ?
        `;
        const [result] = await connection.execute<ResultSetHeader>(sql, [
            item.quantidade,
            item.valor,
            item.id
        ]);
        return result.affectedRows > 0;
    },

delete: async (idItem: number): Promise<boolean> => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const sqlSelect = 'SELECT fk_IdPedido FROM itens_pedido WHERE IdItens_Pedido = ?';
        const [rows]: any = await conn.execute(sqlSelect, [idItem]);

        if (rows.length === 0) {
            await conn.rollback();
            return false; // Item não encontrado
        }

        const idPedido = rows[0].fk_IdPedido;

        const sqlValor = 'SELECT valor FROM pedidos WHERE IdPedido = ?';
        let valor = await conn.execute<ResultSetHeader>(sqlValor, [idItem]);

        console.log(valor)

        const sqlDelete = 'DELETE FROM itens_pedido WHERE IdItens_Pedido = ?';
        const [result] = await conn.execute<ResultSetHeader>(sqlDelete, [idItem]);

        const sqlSoma = 'SELECT SUM(Quantidade * Valor) as novoTotal FROM itens_pedido WHERE fk_IdPedido = ?';
        const [somaRows]: any = await conn.execute(sqlSoma, [idPedido]);
        const novoTotal = somaRows[0].novoTotal || 0;

        const sqlUpdate = 'UPDATE pedidos SET SubTotal = ? WHERE IdPedido = ?';
        await conn.execute(sqlUpdate, [novoTotal, idPedido]);

        await conn.commit();

        return result.affectedRows > 0;

    } catch (error: any) {
        await conn.rollback();
        console.error("Erro ao deletar item:", error);
        throw error;
    } finally {
        conn.release();
    }
}
};