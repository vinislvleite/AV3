const axios = require('axios');
const { performance: perf } = require('perf_hooks');

const URL_ALVO = 'http://localhost:3333/api/aeronaves';

async function simularUsuario(id: number) {
    const inicioTotal = perf.now();

    try {
        const response = await axios.get(URL_ALVO);
        const fimTotal = perf.now();

        const tempoResposta = fimTotal - inicioTotal;
        const tempoProcessamento = parseFloat(response.headers['x-processing-time'] || 0);

        let latencia = tempoResposta - tempoProcessamento;
        if (latencia < 0) latencia = 0;

        return {
            tempoResposta,
            tempoProcessamento,
            latencia
        };
    } catch (error: any) {
        console.error(`Erro no usuário ${id}:`, error.message);
        return null;
    }
}

async function executarCenario(qtdUsuarios: number) {
    console.log(`\n--- TESTE COM ${qtdUsuarios} USUÁRIO(S) ---`);

    const promises = [];
    
    for (let i = 0; i < qtdUsuarios; i++) {
        promises.push(simularUsuario(i + 1));
    }

    const resultados = await Promise.all(promises);
    const validos = resultados.filter(r => r !== null) as { tempoResposta: number, tempoProcessamento: number, latencia: number }[];

    if (validos.length === 0) return;

    const mediaResp = validos.reduce((a, b) => a + b.tempoResposta, 0) / validos.length;
    const mediaProc = validos.reduce((a, b) => a + b.tempoProcessamento, 0) / validos.length;
    const mediaLat = validos.reduce((a, b) => a + b.latencia, 0) / validos.length;

    console.log(`MÉDIAS (${qtdUsuarios} usuários):`);
    console.log(`Tempo de Resposta: ${mediaResp.toFixed(2)} ms`);
    console.log(`Tempo de Processamento: ${mediaProc.toFixed(2)} ms`);
    console.log(`Latência: ${mediaLat.toFixed(2)} ms`);
}

async function main() {
    await executarCenario(1);
    await new Promise(r => setTimeout(r, 2000));

    await executarCenario(5);
    await new Promise(r => setTimeout(r, 2000));

    await executarCenario(10);
}

main();