import { RegistrationData } from "types";

export async function apiUpdateCliente(
  token: string | null,
  clienteId: number | null,
  nome: string,
  telefone: string
): Promise<RegistrationData> {
  const res = await fetch(`/api/clientes/${clienteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, telefone }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao atualizar cliente.");
  }
  return await res.json();
}
