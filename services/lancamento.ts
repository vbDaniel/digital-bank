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

export async function criarLancamento(
  {
    contaId,
    valor,
    tipo,
  }: { contaId: number; valor: number; tipo: "CREDITO" | "DEBITO" },
  clienteId: number
) {
  return prisma.$transaction(async (tx) => {
    const conta = await tx.conta.findUnique({ where: { id: contaId } });
    if (!conta || conta.clienteId !== clienteId) {
      throw new Error("Conta não encontrada ou não pertence ao usuário.");
    }

    if (valor <= 0) {
      throw new Error("Valor deve ser positivo.");
    }

    if (tipo === "DEBITO" && conta.saldo < valor) {
      throw new Error("Saldo insuficiente.");
    }

    const novoSaldo =
      tipo === "CREDITO" ? conta.saldo + valor : conta.saldo - valor;

    await tx.conta.update({
      where: { id: contaId },
      data: { saldo: novoSaldo },
    });

    const lancamento = await tx.lancamento.create({
      data: { valor, tipo, contaId },
    });

    return lancamento;
  });
}
