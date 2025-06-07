import { Conta, Prisma } from "@prisma/client";
import prisma from "lib/prisma";

export async function getLancamentosConta(contaId: number, clienteId: number) {
  const conta = await prisma.conta.findUnique({ where: { id: contaId } });

  if (!conta || conta.clienteId !== clienteId)
    throw new Error("Conta não encontrada ou não pertence ao usuário.");

  return prisma.lancamento.findMany({
    where: { contaId },
    orderBy: { data: "desc" },
  });
}

async function validarConta(
  tx: Prisma.TransactionClient,
  contaId: number,
  clienteId: number
) {
  const conta = await tx.conta.findUnique({ where: { id: contaId } });
  if (!conta || conta.clienteId !== clienteId) {
    throw new Error("Conta não encontrada ou não pertence ao usuário.");
  }
  return conta;
}

async function calcularBonusSeAplicavel(
  tx: Prisma.TransactionClient,
  clienteId: number,
  valor: number
): Promise<number> {
  const contas = await tx.conta.findMany({ where: { clienteId } });
  const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);
  return saldoTotal < valor ? valor * 0.1 : 0;
}

async function atualizarConta(
  tx: Prisma.TransactionClient,
  conta: Conta,
  tipo: "CREDITO" | "DEBITO" | "AJUSTE_LIMITE",
  valor: number,
  bonus: number
) {
  switch (tipo) {
    case "CREDITO":
      return tx.conta.update({
        where: { id: conta.id },
        data: { saldo: conta.saldo + valor + bonus },
      });

    case "DEBITO":
      const limiteDisponivel = conta.saldo + conta.limite;
      if (limiteDisponivel < valor) throw new Error("Saldo insuficiente.");
      return tx.conta.update({
        where: { id: conta.id },
        data: { saldo: conta.saldo - valor },
      });

    case "AJUSTE_LIMITE":
      if (conta.limite > valor)
        throw new Error("Só é possível aumentar o limite.");
      return tx.conta.update({
        where: { id: conta.id },
        data: { limite: valor },
      });

    default:
      throw new Error("Tipo de lançamento inválido.");
  }
}

export async function transferirEntreContas(
  {
    contaOrigemId,
    contaDestinoId,
    valor,
  }: {
    contaOrigemId: number;
    contaDestinoId: number;
    valor: number;
  },
  clienteId: number
) {
  return prisma.$transaction(async (tx) => {
    if (valor <= 0) throw new Error("Valor deve ser positivo.");

    if (contaOrigemId === contaDestinoId)
      throw new Error("Contas de origem e destino não podem ser iguais.");

    const contaOrigem = await validarConta(tx, contaOrigemId, clienteId);

    const limiteDisponivel = contaOrigem.saldo + contaOrigem.limite;
    if (limiteDisponivel < valor) {
      throw new Error("Saldo insuficiente na conta de origem.");
    }

    const contaDestino = await tx.conta.findUnique({
      where: { id: contaDestinoId },
    });

    if (!contaDestino) {
      throw new Error("Conta de destino não encontrada.");
    }

    // Aplica taxa de 10% se for entre clientes diferentes
    let valorTransferencia = valor;
    let taxa = 0;
    let aplicouTaxa = false;
    if (contaDestino.clienteId !== clienteId) {
      taxa = valor * 0.1;
      valorTransferencia = valor - taxa;
      aplicouTaxa = true;

      if (valorTransferencia <= 0) {
        throw new Error("Valor após taxa deve ser positivo.");
      }
    }

    // Atualiza saldos
    const updatedOrigem = await tx.conta.update({
      where: { id: contaOrigem.id },
      data: { saldo: contaOrigem.saldo - valor },
    });

    const updatedDestino = await tx.conta.update({
      where: { id: contaDestino.id },
      data: { saldo: contaDestino.saldo + valorTransferencia },
    });

    // Criar lançamentos
    await tx.lancamento.create({
      data: {
        valor,
        tipo: "TRANSFERENCIA_DEBITO",
        contaId: contaOrigem.id,
      },
    });

    await tx.lancamento.create({
      data: {
        valor: valorTransferencia,
        tipo: "TRANSFERENCIA_CREDITO",
        contaId: contaDestino.id,
      },
    });

    // Lançamento da TAXA
    if (aplicouTaxa && taxa > 0) {
      await tx.lancamento.create({
        data: {
          valor: taxa,
          tipo: "TAXA",
          contaId: contaOrigem.id,
        },
      });
    }

    return {
      origem: updatedOrigem,
      destino: updatedDestino,
      valorOriginal: valor,
      taxa,
      valorTransferido: valorTransferencia,
      updatedAccount: updatedOrigem,
    };
  });
}

async function registrarLancamentos(
  tx: Prisma.TransactionClient,
  contaId: number,
  tipo: "CREDITO" | "DEBITO" | "AJUSTE_LIMITE",
  valor: number,
  bonus: number
) {
  const lancamentoPrincipal = await tx.lancamento.create({
    data: { valor, tipo, contaId },
  });

  if (tipo === "CREDITO" && bonus > 0) {
    await tx.lancamento.create({
      data: {
        valor: bonus,
        tipo: "BONUS" as any, // ou adicione BONUS no enum se quiser
        contaId,
      },
    });
  }

  return lancamentoPrincipal;
}

export async function criarLancamento(
  {
    contaId,
    valor,
    tipo,
  }: {
    contaId: number;
    valor: number;
    tipo: "CREDITO" | "DEBITO" | "AJUSTE_LIMITE";
  },
  clienteId: number
) {
  return prisma.$transaction(async (tx) => {
    if (valor <= 0) throw new Error("Valor deve ser positivo.");

    const conta = await validarConta(tx, contaId, clienteId);

    const bonus =
      tipo === "CREDITO"
        ? await calcularBonusSeAplicavel(tx, clienteId, valor)
        : 0;

    console.log(
      `Criando lançamento: contaId=${contaId}, tipo=${tipo}, valor=${valor}, bonus=${bonus}`
    );

    const updatedAccount = await atualizarConta(tx, conta, tipo, valor, bonus);

    const transaction = await registrarLancamentos(
      tx,
      contaId,
      tipo,
      valor,
      bonus
    );

    return { updatedAccount, transaction };
  });
}
