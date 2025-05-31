import { Account, Transaction } from "types";

// Busca todas as contas do usuário autenticado
export async function apiGetAccounts(token: string): Promise<Account[]> {
  const res = await fetch("/api/contas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao buscar contas.");
  }
  return await res.json();
}

// Cria uma nova conta para o usuário autenticado
export async function apiCreateAccount(
  token: string,
  nome: string
): Promise<Account> {
  const res = await fetch("/api/contas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao criar conta.");
  }
  return await res.json();
}

// Realiza depósito ou saque
export async function apiCreateTransaction(
  token: string,
  accountId: string,
  tipo: "CREDITO" | "DEBITO",
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

// Consulta extrato da conta
export async function apiGetStatement(
  token: string,
  accountId: string
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
