import prisma from "lib/prisma";

// Gera número de conta único
function gerarNumeroConta(nome: string): string {
  return (
    nome.slice(0, 2).toUpperCase() + Math.floor(100000 + Math.random() * 900000)
  );
}

// Cria uma nova conta para o cliente
export async function criarConta(clienteId: number, nome: string) {
  let numero: string;
  do {
    numero = gerarNumeroConta(nome);
  } while (await prisma.conta.findUnique({ where: { numero } }));

  return prisma.conta.create({
    data: { numero, clienteId },
  });
}

// Lista todas as contas de um cliente
export async function listarContas(clienteId: number) {
  return prisma.conta.findMany({
    where: { clienteId },
    select: { id: true, numero: true, saldo: true },
  });
}

// Busca uma conta pelo ID e valida se pertence ao cliente
export async function getContaById(contaId: number, clienteId: number) {
  const conta = await prisma.conta.findUnique({
    where: { id: contaId },
    select: { id: true, numero: true, saldo: true, clienteId: true },
  });

  if (!conta || conta.clienteId !== clienteId) {
    throw new Error("Conta não encontrada ou não pertence ao usuário.");
  }

  return conta;
}
