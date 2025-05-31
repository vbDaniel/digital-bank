// services/authApi.ts
import { RegistrationData, LoginData } from "types";

export async function apiRegister(data: RegistrationData) {
  const res = await fetch("/api/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao cadastrar.");
  }

  return await res.json();
}

export async function apiLogin(data: LoginData) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao fazer login.");
  }

  return await res.json();
}
