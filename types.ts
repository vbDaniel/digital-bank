export interface User {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  // Senha não é armazenada no frontend após login
}

export enum AccountType {
  CORRENTE = "CORRENTE",
}

// Conforme DTO, para listagens e extratos
export interface AccountDTO {
  id: string;
  numero: string; // Formato AA-999999
  // cpfCliente: string; // O CPF do cliente já é conhecido no contexto do cliente logado
  saldo: number; // Saldo deve vir do backend
}

export interface Account extends AccountDTO {
  // clienteId: string; // Já está implícito pelo usuário logado
  // No frontend, podemos adicionar o nome do cliente para exibição se necessário,
  // mas a API de contas pode retornar apenas o DTO.
}

export enum TransactionType {
  CREDITO = "credito", // Kept as lowercase to match usage in TransactionForm
  DEBITO = "debito", // Kept as lowercase to match usage in TransactionForm
}

export interface Transaction {
  id: string;
  // contaId: string; // Implícito pela conta selecionada
  tipo: TransactionType;
  valor: number;
  data: string; // ISO date string
  descricao?: string; // Opcional, para depósitos/saques pode ser "Depósito em conta" / "Saque de conta"
}

// Para o formulário de cadastro
export interface RegistrationData {
  nome: string;
  cpf: string;
  telefone: string;
  senha?: string; // Senha é enviada apenas no cadastro
}

export interface LoginData {
  cpf: string;
  senha?: string;
}
