import { Aeronave } from "./aeronave";
import { Peca } from "./peca";
import { EtapaProducao } from "./etapasproducao";
import { Teste } from "./teste";
import * as fs from 'fs';
import * as path from 'path';

export class Relatorio {
    
    gerarRelatorio(aeronave: Aeronave, pecas: Peca[], etapas: EtapaProducao[], testes: Teste[]): void {
        const relatorio = this.criarRelatorioDetalhado(aeronave, pecas, etapas, testes);
        console.log(relatorio);
    }
    
    salvarEmArquivo(aeronave: Aeronave, pecas: Peca[], etapas: EtapaProducao[], testes: Teste[]): void {
        const relatorio = this.criarRelatorioDetalhado(aeronave, pecas, etapas, testes);
        const nomeArquivo = `relatorios/relatorio_aeronave_${aeronave.codigo}_${new Date().toISOString().split('T')[0]}.txt`;
        
        const dir = path.dirname(nomeArquivo);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(nomeArquivo, relatorio, 'utf-8');
        console.log(`Relatorio salvo em: ${nomeArquivo}`);
    }

    private criarRelatorioDetalhado(aeronave: Aeronave, pecas: Peca[], etapas: EtapaProducao[], testes: Teste[]): string {
        return `
Relatorio da aeronave

Informacoes da aeronave:
• Codigo: ${aeronave.codigo}
• Modelo: ${aeronave.modelo}
• Tipo: ${aeronave.tipo}
• Capacidade: ${aeronave.capacidade} passageiros
• Alcance: ${aeronave.alcance} km
• Cliente: ${aeronave.cliente}
• Data de Entrega: ${aeronave.dataEntrega}

Pecas usadas:
${pecas.length > 0 
    ? pecas.map((peca, index) => 
        `${index + 1}. ${peca.nome} | Tipo: ${peca.tipo} | Fornecedor: ${peca.fornecedor} | Status: ${peca.status}`
      ).join('\n')
    : 'Nenhuma peca registrada'}

Etapas de producao da aeronave:
${etapas.length > 0 
    ? etapas.map((etapa, index) => 
        `${index + 1}. ${etapa.nome} | Prazo: ${etapa.prazoConclusao.toLocaleDateString('pt-BR')} | Status: ${etapa.status}`
      ).join('\n')
    : 'Nenhuma etapa registrada'}

Resultado dos testes:
${testes.length > 0 
    ? testes.map((teste, index) => 
        `${index + 1}. ${teste.tipo} | Resultado: ${teste.resultado}`
      ).join('\n')
    : 'Nenhum teste registrado'}

Data de emissao: ${new Date().toLocaleDateString('pt-BR')}
        `.trim();
    }
}