import { PrismaClient, Permissao, TipoAeronave } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed...')

  // 1. CRIAR USUÁRIOS
  // ---------------------------------------------------------
  await prisma.funcionario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nome: 'Administrador Principal',
      usuario: 'admin',
      senha: '123',
      telefone: '11999999999',
      endereco: 'Sede Principal',
      nivelPermissao: Permissao.ADMINISTRADOR 
    },
  })

  await prisma.funcionario.upsert({
    where: { usuario: 'engenheiro' },
    update: {},
    create: {
      nome: 'Engenheiro Chefe',
      usuario: 'engenheiro',
      senha: '123',
      telefone: '11888888888',
      endereco: 'Hangar 1',
      nivelPermissao: Permissao.ENGENHEIRO
    },
  })

  await prisma.funcionario.upsert({
    where: { usuario: 'operador' },
    update: {},
    create: {
      nome: 'Operador de Linha',
      usuario: 'operador',
      senha: '123',
      telefone: '11777777777',
      endereco: 'Fábrica',
      nivelPermissao: Permissao.OPERADOR
    },
  })

  console.log('✅ Usuários criados com sucesso.')

  // 2. CRIAR AERONAVE (Agora com ID NUMÉRICO)
  // ---------------------------------------------------------
  await prisma.aeronave.upsert({
    where: { codigo: 1 },
    update: {},
    create: {
      codigo: 1,
      modelo: 'Protótipo Alpha',
      tipo: TipoAeronave.MILITAR,
      capacidade: 2,
      alcance: 5000,
      cliente: 'Força Aérea',
      dataEntrega: new Date().toISOString()
    }
  })

  console.log('✅ Aeronave criada: Código 1')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })