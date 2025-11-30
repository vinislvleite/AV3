import express from 'express';
import cors from 'cors';
import { performance as perf } from 'perf_hooks';

import { aeronaveRoutes } from './routes/aeronaveRoute';
import { funcionarioRoutes } from './routes/funcionarioRoute';
import { pecaRoutes } from './routes/pecaRoute';
import { etapaRoutes } from './routes/etapaRoute';
import { testeRoutes } from './routes/testeRoute';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const start = perf.now();

    const originalJson = res.json;
    res.json = function (body) {
        const end = perf.now();
        const time = end - start;
        res.setHeader('X-Processing-Time', time.toFixed(2));
        return originalJson.call(this, body);
    };

    res.on('finish', () => {
        const end = perf.now();
        const time = end - start;
        console.log(`[REQUEST] ${req.method} ${req.url} | Processamento: ${time.toFixed(2)}ms`);
    });

    next();
});

app.use('/api/aeronaves', aeronaveRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/pecas', pecaRoutes);
app.use('/api/etapas', etapaRoutes);
app.use('/api/testes', testeRoutes);

app.get('/', (req, res) => {
    res.send('API Aerocode rodando com sucesso!');
});

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});