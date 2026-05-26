// server.ts - Servidor Routex

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//importar rotas
import veiculosRouter from './routes/Veiculos';

// Carregar variáveis de ambiente
dotenv.config();

// Criar app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/veiculos', veiculosRouter);

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API Routex',
        version: '1.0.0',
        status: 'online'
    });
});

// // Rota de saúde
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         timestamp: new Date().toISOString(),
//         uptime: process.uptime()
//     });
// });

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor Routex rodando na porta ${port}`);
    console.log(`📍 Local: http://localhost:${port}`);
});