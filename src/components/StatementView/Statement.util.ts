import { Account, Transaction, TransactionType } from "types";

// Consulta extrato da conta
export async function apiGetStatement(
  token: string,
  accountId: number
): Promise<Transaction[]> {
  const res = await fetch(`/api/contas/${accountId}/lancamentos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao buscar extrato.");
  }
  return await res.json();
}
