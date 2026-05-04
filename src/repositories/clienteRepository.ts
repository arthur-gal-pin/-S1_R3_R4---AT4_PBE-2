import { ResultSetHeader } from 'mysql2';
import { connection } from '../configs/Database';
import { Cliente } from '../models/Cliente';
import { Telefone } from '../models/Telefone';
import { Endereco } from '../models/Endereco';

const clienteRepository = {
    create: async (cliente: Cliente, telefone: Telefone, endereco: Endereco): Promise<{}> => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sqlCli = 'INSERT INTO clientes (NomeCliente, SobrenomeCliente, CPF, email) VALUES (?,?,?,?)';
            const valuesCli = [cliente.nomeCliente, cliente.sobrenomeCliente, cliente.cpf, cliente.email];
            const [rowsCli] = await conn.execute<ResultSetHeader>(sqlCli, valuesCli);

            const novoIdCliente = rowsCli.insertId;

            const sqlTel = 'INSERT INTO telefones (Numero, TipoTelefone, fk_idCliente) VALUES (?,?,?)';
            const valuesTel = [telefone.numero, telefone.tipo, novoIdCliente];
            const [rowsTel] = await conn.execute<ResultSetHeader>(sqlTel, valuesTel);

            const sqlEnd = 'INSERT INTO enderecos (fk_idCliente, CEP, UF, Cidade, Bairro, Logradouro, Numero, Complemento) VALUES (?,?,?,?,?,?,?,?)';
            const valuesEnd = [
                novoIdCliente,
                endereco.cep,
                endereco.UF,
                endereco.cidade,
                endereco.bairro,
                endereco.logradouro,
                endereco.numero,
                endereco.complemento
            ];
            const [rowsEnd] = await conn.execute<ResultSetHeader>(sqlEnd, valuesEnd);

            await conn.commit();
            return { rowsCli, rowsTel, rowsEnd };

        } catch (error: any) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    read: async (pNome?: string, id?: number): Promise<any[]> => {
        let sql = `
            SELECT c.*, t.Numero as Telefone, t.TipoTelefone, e.Logradouro, e.Cidade, e.UF 
            FROM clientes c
            LEFT JOIN telefones t ON c.IdCliente = t.fk_idCliente
            LEFT JOIN enderecos e ON c.IdCliente = e.fk_idCliente
            WHERE 1=1`;
        
        const values: any[] = [];

        if (id) {
            sql += ' AND c.IdCliente = ?';
            values.push(id);
        } else if (pNome) {
            sql += ' AND c.NomeCliente LIKE ?';
            values.push(`%${pNome}%`);
        }

        const [rows] = await connection.execute(sql, values);
        return rows as any[];
    },

    update: async (cliente: Cliente): Promise<ResultSetHeader> => {
        const sql = 'UPDATE clientes SET NomeCliente=?, SobrenomeCliente=?, CPF=?, email=? WHERE IdCliente = ?';
        const values = [cliente.nomeCliente, cliente.sobrenomeCliente, cliente.cpf, cliente.email, cliente.idCliente];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },

    delete: async (idCliente: number): Promise<{}> => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute('DELETE FROM telefones WHERE fk_idCliente=?', [idCliente]);
            await conn.execute('DELETE FROM enderecos WHERE fk_idCliente=?', [idCliente]);
            const [rowsCli] = await conn.execute<ResultSetHeader>('DELETE FROM clientes WHERE IdCliente=?', [idCliente]);

            await conn.commit();
            return { rowsCli };
        } catch (error: any) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },
}

const telefoneRepository = {
    create: async (telefone: Telefone): Promise<ResultSetHeader> => {
        const sql = 'INSERT INTO telefones (Numero, TipoTelefone, fk_idCliente) VALUES (?,?,?)';
        const values = [telefone.numero, telefone.tipo, telefone.idCliente];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },

    read: async (pNumero?: string, pId?: number, pIdCliente?: number): Promise<Telefone[]> => {
        let sql = 'SELECT * FROM telefones WHERE 1=1';
        const values: any[] = [];
        
        if (pNumero) {
            sql += ' AND Numero LIKE ?';
            values.push(`%${pNumero}%`);
        } else if (pIdCliente) {
            sql += ' AND fk_idCliente = ?';
            values.push(pIdCliente);
        } else if (pId) {
            sql += ' AND IdTelefone = ?';
            values.push(pId);
        }
        
        const [rows] = await connection.execute(sql, values);
        return rows as Telefone[];
    },

    update: async (telefone: Telefone): Promise<ResultSetHeader> => {
        const sql = 'UPDATE telefones SET Numero=?, TipoTelefone=?, fk_idCliente=? WHERE IdTelefone = ?';
        const values = [telefone.numero, telefone.tipo, telefone.idCliente, telefone.id];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },

    delete: async (idTelefone: number): Promise<ResultSetHeader> => {
        const sql = 'DELETE FROM telefones WHERE IdTelefone = ?';
        const [rows] = await connection.execute<ResultSetHeader>(sql, [idTelefone]);
        return rows;
    }
}

const enderecoRepository = {
    create: async (endereco: Endereco): Promise<ResultSetHeader> => {
        const sql = 'INSERT INTO enderecos (fk_idCliente, CEP, UF, Cidade, Bairro, Logradouro, Numero, Complemento) VALUES (?,?,?,?,?,?,?,?)';
        const values = [endereco.idCliente, endereco.cep, endereco.UF, endereco.cidade, endereco.bairro, endereco.logradouro, endereco.numero, endereco.complemento];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },

    read: async (pId?: number, pIdCliente?: number): Promise<Endereco[]> => {
        let sql = 'SELECT * FROM enderecos WHERE 1=1';
        const values: any[] = [];
        
        if (pId) {
            sql += ' AND IdEndereco = ?';
            values.push(pId);
        } else if (pIdCliente) {
            sql += ' AND fk_idCliente = ?';
            values.push(pIdCliente);
        }
        
        const [rows] = await connection.execute(sql, values);
        return rows as Endereco[];
    },

    update: async (endereco: Endereco): Promise<ResultSetHeader> => {
        const sql = 'UPDATE enderecos SET fk_idCliente=?, CEP=?, UF=?, Cidade=?, Bairro=?, Logradouro=?, Numero=?, Complemento=? WHERE IdEndereco=?';
        const values = [
            endereco.idCliente, endereco.cep, endereco.UF, endereco.cidade, 
            endereco.bairro, endereco.logradouro, endereco.numero, 
            endereco.complemento, endereco.id
        ];
        const [rows] = await connection.execute<ResultSetHeader>(sql, values);
        return rows;
    },

    delete: async (IdEndereco: number): Promise<ResultSetHeader> => {
        const sql = 'DELETE FROM enderecos WHERE IdEndereco = ?';
        const [rows] = await connection.execute<ResultSetHeader>(sql, [IdEndereco]);
        return rows;
    }
}

export default { clienteRepository, telefoneRepository, enderecoRepository };