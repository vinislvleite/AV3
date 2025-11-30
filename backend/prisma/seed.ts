import {
  PrismaClient,
  Permissao,
  TipoAeronave,
  TipoPeca,
  StatusPeca,
  TipoTeste,
  ResultadoTeste
} from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const DEFAULT_PASSWORD = "123"
const SALT_ROUNDS = 10;

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS)

  const admin = await prisma.funcionario.upsert({
    where: { usuario: "admin" },
    update: { senha: passwordHash },
    create: {
      nome: "Administrador Principal",
      telefone: "11999999999",
      endereco: "Sede Central",
      usuario: "admin",
      senha: passwordHash,
      nivelPermissao: Permissao.ADMINISTRADOR
    }
  })

  const engenheiro = await prisma.funcionario.upsert({
    where: { usuario: "engenheiro" },
    update: { senha: passwordHash },
    create: {
      nome: "Engenheiro Chefe",
      telefone: "11888888888",
      endereco: "Hangar 1",
      usuario: "engenheiro",
      senha: passwordHash,
      nivelPermissao: Permissao.ENGENHEIRO
    }
  })

  const operador = await prisma.funcionario.upsert({
    where: { usuario: "operador" },
    update: { senha: passwordHash },
    create: {
      nome: "Operador de Linha",
      telefone: "11777777777",
      endereco: "Linha de Montagem",
      usuario: "operador",
      senha: passwordHash,
      nivelPermissao: Permissao.OPERADOR
    }
  })

  const aeronave = await prisma.aeronave.upsert({
    where: { codigo: 1 },
    update: {},
    create: {
      codigo: 1,
      modelo: "Protótipo Alpha",
      tipo: TipoAeronave.MILITAR,
      capacidade: 2,
      alcance: 4500,
      cliente: "Força Aérea Brasileira",
      dataEntrega: new Date().toISOString()
    }
  })

  const peca1 = await prisma.peca.create({
    data: {
      nome: "Painel de Controle",
      tipo: TipoPeca.NACIONAL,
      fornecedor: "AeroTech Brasil",
      status: StatusPeca.EM_PRODUCAO,
      aeronaveId: aeronave.codigo
    }
  })

  const peca2 = await prisma.peca.create({
    data: {
      nome: "Sistema Hidráulico",
      tipo: TipoPeca.IMPORTADA,
      fornecedor: "HydroMax",
      status: StatusPeca.EM_TRANSPORTE,
      aeronaveId: aeronave.codigo
    }
  })

  const peca3 = await prisma.peca.create({
    data: {
      nome: "Conjunto Aerodinâmico",
      tipo: TipoPeca.NACIONAL,
      fornecedor: "WingCorp SA",
      status: StatusPeca.PRONTA,
      aeronaveId: aeronave.codigo
    }
  })

  const etapa1 = await prisma.etapaProducao.create({
    data: {
      nome: "Montagem Estrutural",
      prazoConclusao: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 0,
      aeronaveId: aeronave.codigo
    }
  })

  const etapa2 = await prisma.etapaProducao.create({
    data: {
      nome: "Integração de Sistemas",
      prazoConclusao: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 0,
      aeronaveId: aeronave.codigo
    }
  })

  const etapa3 = await prisma.etapaProducao.create({
    data: {
      nome: "Revisão Final",
      prazoConclusao: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 0,
      aeronaveId: aeronave.codigo
    }
  })

  await prisma.etapaFuncionario.createMany({
    data: [
      { etapaId: etapa1.id, funcionarioId: engenheiro.id },
      { etapaId: etapa2.id, funcionarioId: operador.id },
      { etapaId: etapa3.id, funcionarioId: admin.id }
    ]
  })

  const teste1 = await (prisma.teste.create as any)({
    data: {
      nome: "Teste Elétrico de Painel",
      tipo: TipoTeste.ELETRICO,
      resultado: ResultadoTeste.APROVADO,
      aeronaveId: aeronave.codigo
    }
  })

  const teste2 = await (prisma.teste.create as any)({
    data: {
      nome: "Teste de Túnel de Vento",
      tipo: TipoTeste.AERODINAMICO,
      resultado: ResultadoTeste.REPROVADO,
      aeronaveId: aeronave.codigo
    }
  })

  const teste3 = await (prisma.teste.create as any)({
    data: {
      nome: "Teste de Pressão Hidráulica",
      tipo: TipoTeste.HIDRAULICO,
      resultado: ResultadoTeste.APROVADO,
      aeronaveId: aeronave.codigo
    }
  })

  await prisma.relatorio.create({
    data: {
      aeronaveId: aeronave.codigo
    }
  })
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })