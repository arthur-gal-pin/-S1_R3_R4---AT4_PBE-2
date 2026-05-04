import mysql, { Pool } from 'mysql2/promise';
import 'dotenv/config';


if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    throw new Error("Faltando variavéis críticas para o banco de dados.");
}

// Padrão de projeto utilizado na classe de conexão com banco de dados: SINGLETON
class Database {
    private static instance : Database | null = null;
    private pool!: mysql.Pool;
    private createPool() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: Number(process.env.DB_PORT),
            waitForConnections: true,
            connectionLimit: 50,
            queueLimit: 0,
            timezone: 'Z'
        })
    }
    public static getInstance(){
        if (!Database.instance){
            Database.instance = new Database();
            Database.instance.createPool();
        }
        return Database.instance;
    }
    public getPool(){
        return this.pool;
    }
}

export const connection = Database.getInstance().getPool();