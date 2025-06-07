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

// Busca todas as contas do usuário autenticado
export async function apiGetAllAccounts(token: string): Promise<Account[]> {
  const res = await fetch("/api/contas?all=true", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar todas as contas.");
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
  tipo: "CREDITO" | "DEBITO" | "AJUSTE_LIMITE",
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
    method: "GET",
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

// Remove uma conta do usuário autenticado
export async function apiDeleteAccount(
  token: string,
  accountId: string
): Promise<void> {
  const res = await fetch(`/api/contas/${accountId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao remover conta.");
  }
}

export async function apiCreateTransfer(
  token: string,
  accountIdOrigem: string,
  accountIdDestino: string,
  valor: number
): Promise<{
  updatedAccount: Account;
  destino: Account;
  transaction: Transaction;
}> {
  const res = await fetch("/api/transferencia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contaOrigemId: accountIdOrigem,
      contaDestinoId: accountIdDestino,
      valor,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao realizar transação.");
  }

  return await res.json();
}
