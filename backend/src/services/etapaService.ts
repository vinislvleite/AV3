import { EtapaProducao } from "../classes/etapasproducao";
import { Funcionario } from "../classes/funcionario";
import { FileManager } from "../classes/fileManager";
import { StatusEtapa } from "../enums/StatusEtapa";
import * as path from 'path';


interface EtapaData {
    nome: string;
    prazoConclusao: string;
    status: StatusEtapa;
    funcionarios: Funcionario[];
    aeronaveCodigo: string;
    ordem: number;
}

export class EtapaService {
    private etapas: EtapaProducao[] = [];
    private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'etapas.json');

    constructor() {
        this.carregar();
    }

    public cadastrarEtapa(etapa: EtapaProducao, aeronaveCodigo: string, ordem: number): void {
        (etapa as any).aeronaveCodigo = aeronaveCodigo;
        (etapa as any).ordem = ordem;
        
        this.etapas.push(etapa);
        this.salvar();
        console.log("Etapa cadastrada com sucesso");
    }

    public listarEtapasAeronave(aeronaveCodigo: string): EtapaProducao[] {
        return this.etapas
            .filter(e => (e as any).aeronaveCodigo === aeronaveCodigo)
            .sort((a, b) => (a as any).ordem - (b as any).ordem);
    }

    public iniciarEtapaValidacao(nome: string, aeronaveCodigo: string): void {
        const etapa = this.etapas.find(e => e.nome === nome && (e as any).aeronaveCodigo === aeronaveCodigo);
        
        if (!etapa) {
            console.log("Etapa não encontrada");
            return;
        }

        const ordem = (etapa as any).ordem;
        
        if (ordem > 1) {
            const etapaAnterior = this.etapas.find(e => 
                (e as any).aeronaveCodigo === aeronaveCodigo && (e as any).ordem === ordem - 1
            );
            
            if (etapaAnterior && etapaAnterior.status !== StatusEtapa.CONCLUIDO) {
                console.log(`Não é possível iniciar "${etapa.nome}". A etapa anterior precisa ser concluída primeiro.`);
                return;
            }
        }

        etapa.iniciar();
        this.salvar();
    }

    public finalizarEtapaValidacao(nome: string, aeronaveCodigo: string): void {
        const etapa = this.etapas.find(e => e.nome === nome && (e as any).aeronaveCodigo === aeronaveCodigo);
        
        if (etapa) {
            etapa.finalizar();
            this.salvar();
        } else {
            console.log("Etapa não encontrada");
        }
    }

    public associarFuncionario(aeronaveCodigo: string, nomeEtapa: string, funcionario: Funcionario): boolean {
        const etapa = this.etapas.find(e => e.nome === nomeEtapa && (e as any).aeronaveCodigo === aeronaveCodigo);
        
        if (etapa) {
            etapa.associarFuncionario(funcionario);
            this.salvar();
            return true;
        } else {
            console.log("Etapa não encontrada");
            return false;
        }
    }

    public listarFuncionariosEtapa(nome: string, aeronaveCodigo: string): void {
        const etapa = this.etapas.find(e => e.nome === nome && (e as any).aeronaveCodigo === aeronaveCodigo);
        
        if (etapa) {
            const funcionarios = etapa.listarFuncionarios();
            if (funcionarios.length === 0) {
                console.log("Nenhum funcionário associado a esta etapa.");
            } else {
                funcionarios.forEach(f => console.log(`${f.nome} - ${f.nivelPermissao}`));
            }
        } else {
            console.log("Etapa não encontrada");
        }
    }

    private salvar(): void {
        FileManager.salvar(EtapaService.dataFilePath, this.etapas);
    }

    private carregar(): void {
        const etapasSalvas = FileManager.carregar<EtapaData>(EtapaService.dataFilePath);

        if (!etapasSalvas || etapasSalvas.length === 0) {
            this.etapas = [];
            return;
        }

        this.etapas = etapasSalvas.map((dadoEtapa: EtapaData) => {
            const prazo = new Date(dadoEtapa.prazoConclusao);

            const etapa = new EtapaProducao(dadoEtapa.nome, prazo, dadoEtapa.status);
            
            etapa.funcionarios = dadoEtapa.funcionarios || []; 
            (etapa as any).aeronaveCodigo = dadoEtapa.aeronaveCodigo;
            (etapa as any).ordem = dadoEtapa.ordem;

            return etapa;
        });
    }
}