import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// // configuração da conexão com PostgresSQL
// const pool = new Pool({
//     user: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || 'postgres',
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT || '5432'),
//     database: process.env.DB_NAME || 'routex',
// });

// //Testar conexão
// pool.connect((err, client, release) => {
//     if(err) {
//         console.error('❌ Erro ao conectar ao banco:', err.stack);
//     } else {
//         console.log('✅ Conectado ao PostgreSQL');
//         release();
//     }
// });

// config/database.ts
// Configuração fake para compatibilidade (usando MOCK)

console.log('⚠️ ROUTEX rodando em modo MOCK (sem PostgreSQL)');
console.log('📦 Os dados serão armazenados apenas em memória');
console.log('⚠️ Ao reiniciar o servidor, os dados serão perdidos!');

// Pool fake para compatibilidade com código existente
export const pool = {
    query: async (text: string, params: any[]) => {
        console.log(`📝 Query simulada: ${text.substring(0, 50)}...`);
        return { rows: [], rowCount: 0 };
    },
    connect: async () => {
        console.log('✅ Mock conectado');
        return { release: () => {} };
    }
};


export default pool;