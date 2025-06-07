import { Account, Transaction, TransactionType } from "types";

// Realiza depósito ou saque
export async function apiCreateTransaction(
  token: string,
  accountId: number,
  tipo: TransactionType,
  valor: number
): Promise<{ updatedAccount: Account; transaction: Transaction }> {
  const res = await fetch("/api/lancamentos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contaId: accountId, tipo, valor }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao realizar transação.");
  }
  return await res.json();
}
