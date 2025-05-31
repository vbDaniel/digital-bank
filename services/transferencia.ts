import prisma from "lib/prisma";

interface TransferirParams {
  contaOrigemId: number;
  contaDestinoNumero: string;
  valor: number;
}

export async function transferir(
  { contaOrigemId, contaDestinoNumero, valor }: TransferirParams,
  clienteId: number
) {
  return prisma.$transaction(async (tx) => {
    const origem = await tx.conta.findUnique({ where: { id: contaOrigemId } });
    if (!origem || origem.clienteId !== clienteId) {
      throw new Error(
        "Conta de origem não encontrada ou não pertence ao usuário."
      );
    }
    if (valor <= 0) {
      throw new Error("Valor deve ser positivo.");
    }
    if (origem.saldo < valor) {
      throw new Error("Saldo insuficiente.");
    }

    const destino = await tx.conta.findUnique({
      where: { numero: contaDestinoNumero },
    });
    if (!destino) {
      throw new Error("Conta de destino não encontrada.");
    }
    if (origem.id === destino.id) {
      throw new Error("Não é possível transferir para a mesma conta.");
    }

    // Atualiza saldos
    await Promise.all([
      tx.conta.update({
        where: { id: origem.id },
        data: { saldo: origem.saldo - valor },
      }),
      tx.conta.update({
        where: { id: destino.id },
        data: { saldo: destino.saldo + valor },
      }),
    ]);

    // Cria lançamentos
    await Promise.all([
      tx.lancamento.create({
        data: { valor, tipo: "DEBITO", contaId: origem.id },
      }),
      tx.lancamento.create({
        data: { valor, tipo: "CREDITO", contaId: destino.id },
      }),
    ]);

    return { ok: true };
  });
}
