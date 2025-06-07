export interface User {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export enum AccountType {
  CORRENTE = "CORRENTE",
}

export interface AccountDTO {
  id: string;
  numero: string;
  saldo: number;
  limite: number;
  cliente: User;
}

export interface Account extends AccountDTO {}

export enum TransactionType {
  CREDITO = "credito",
  DEBITO = "debito",
  AJUSTE_LIMITE = "ajuste_limite",
  BONUS = "bonus",
  TRANSFERENCIA_CREDITO = "transferencia_credito",
  TRANSFERENCIA_DEBITO = "transferencia_debito",
}

export interface Transaction {
  id: string;
  tipo: TransactionType;
  valor: number;
  data: string;
  descricao?: string;
}

export interface RegistrationData {
  nome: string;
  cpf: string;
  telefone: string;
  senha?: string;
  contas?: AccountDTO[];
}

export interface LoginData {
  cpf: string;
  senha?: string;
}
