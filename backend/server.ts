import express from 'express';
import cors from 'cors';

import { aeronaveRoutes } from './routes/aeronaveRoute';
import { funcionarioRoutes } from './routes/funcionarioRoute';
import { pecaRoutes } from './routes/pecaRoute';
import { etapaRoutes } from './routes/etapaRoute';
import { testeRoutes } from './routes/testeRoute';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/aeronaves', aeronaveRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/pecas', pecaRoutes);
app.use('/api/etapas', etapaRoutes);
app.use('/api/testes', testeRoutes);

app.get('/', (req, res) => {
    res.send('✈️ API Aerocode rodando com sucesso!');
});

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});