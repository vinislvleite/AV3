import {
  PrismaClient,
  Permissao,
  TipoAeronave,
  TipoPeca,
  StatusPeca,
  TipoTeste,
  ResultadoTeste
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed...")

  const admin = await prisma.funcionario.upsert({
    where: { usuario: "admin" },
    update: {},
    create: {
      nome: "Administrador Principal",
      telefone: "11999999999",
      endereco: "Sede Central",
      usuario: "admin",
      senha: "123",
      nivelPermissao: Permissao.ADMINISTRADOR
    }
  })

  const engenheiro = await prisma.funcionario.upsert({
    where: { usuario: "engenheiro" },
    update: {},
    create: {
      nome: "Engenheiro Chefe",
      telefone: "11888888888",
      endereco: "Hangar 1",
      usuario: "engenheiro",
      senha: "123",
      nivelPermissao: Permissao.ENGENHEIRO
    }
  })

  const operador = await prisma.funcionario.upsert({
    where: { usuario: "operador" },
    update: {},
    create: {
      nome: "Operador de Linha",
      telefone: "11777777777",
      endereco: "Linha de Montagem",
      usuario: "operador",
      senha: "123",
      nivelPermissao: Permissao.OPERADOR
    }
  })

  console.log("✅ Funcionários criados.")

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

  console.log("✅ Aeronave criada.")

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

  console.log("✅ Peças criadas.")

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

  console.log("✅ Etapas de produção criadas.")

  await prisma.etapaFuncionario.createMany({
    data: [
      { etapaId: etapa1.id, funcionarioId: engenheiro.id },
      { etapaId: etapa2.id, funcionarioId: operador.id },
      { etapaId: etapa3.id, funcionarioId: admin.id }
    ]
  })

  console.log("✅ Relações funcionário-etapa criadas.")

  await prisma.teste.createMany({
    data: [
      {
        tipo: TipoTeste.ELETRICO,
        resultado: ResultadoTeste.APROVADO,
        aeronaveId: aeronave.codigo
      },
      {
        tipo: TipoTeste.AERODINAMICO,
        resultado: ResultadoTeste.REPROVADO,
        aeronaveId: aeronave.codigo
      }
    ]
  })

  console.log("✅ Testes criados.")

  await prisma.relatorio.create({
    data: {
      aeronaveId: aeronave.codigo
    }
  })

  console.log("✅ Relatórios criados.")

  console.log("🌱 Seed finalizado com sucesso!")
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
