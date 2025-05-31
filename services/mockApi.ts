import {
  User,
  Account,
  Transaction,
  TransactionType,
  RegistrationData,
  LoginData,
} from "../types";
import { generateAccountNumber } from "../utils/helpers";

// Simulação de banco de dados em memória
let mockUsers: User[] = [];
let mockAccounts: Account[] = [];
let mockTransactions: Transaction[] = [];

// Para garantir CPF e número de conta únicos
const existingCpfs = new Set<string>();
const existingAccountNumbers = new Set<string>();

export const mockRegister = (
  data: RegistrationData
): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (existingCpfs.has(data.cpf)) {
        reject(new Error("CPF já cadastrado."));
        return;
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        // senha não é armazenada aqui, apenas o formData a teria
      };
      mockUsers.push(newUser);
      existingCpfs.add(data.cpf);
      resolve({ user: newUser, token: `mock-token-${newUser.id}` });
    }, 500);
  });
};

export const mockLogin = (
  data: LoginData
): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.cpf === data.cpf /* && u.senha === data.senha */
      ); // Senha não é comparada aqui por segurança
      if (user) {
        // Em um cenário real, a senha seria validada no backend
        resolve({ user, token: `mock-token-${user.id}` });
      } else {
        reject(new Error("CPF ou senha inválidos."));
      }
    }, 500);
  });
};

export const mockGetAccounts = (
  userId: string,
  token: string
): Promise<Account[]> => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("Não autorizado"));
      return;
    }
    setTimeout(() => {
      const userAccounts = mockAccounts.filter((acc) =>
        acc.id.includes(userId)
      ); // Simplificação
      resolve(userAccounts);
    }, 500);
  });
};

export const mockCreateAccount = (
  userId: string,
  firstName: string,
  token: string
): Promise<Account> => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("Não autorizado"));
      return;
    }
    setTimeout(() => {
      let accountNumber;
      do {
        accountNumber = generateAccountNumber(firstName);
      } while (existingAccountNumbers.has(accountNumber));

      const newAccount: Account = {
        id: `acc-${Date.now()}-${userId}`,
        numero: accountNumber,
        saldo: 0,
      };
      mockAccounts.push(newAccount);
      existingAccountNumbers.add(accountNumber);
      resolve(newAccount);
    }, 500);
  });
};

export const mockCreateTransaction = (
  accountId: string,
  type: TransactionType,
  value: number,
  token: string
): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("Não autorizado"));
      return;
    }
    setTimeout(() => {
      const account = mockAccounts.find((acc) => acc.id === accountId);
      if (!account) {
        reject(new Error("Conta não encontrada."));
        return;
      }
      if (type === TransactionType.DEBITO && account.saldo < value) {
        reject(new Error("Saldo insuficiente."));
        return;
      }
      if (value <= 0) {
        reject(new Error("Valor da transação deve ser positivo."));
        return;
      }

      if (type === TransactionType.DEBITO) {
        account.saldo -= value;
      } else {
        account.saldo += value;
      }

      const newTransaction: Transaction = {
        id: `trans-${Date.now()}`,
        tipo: type,
        valor: value,
        data: new Date().toISOString(),
        descricao:
          type === TransactionType.CREDITO
            ? "Depósito em conta"
            : "Saque em conta",
      };
      // Associate transaction with account for better mockGetStatement
      const accountTransactions = mockTransactions.filter((tx) =>
        tx.id.startsWith(`trans-${accountId}`)
      );
      mockTransactions.push({
        ...newTransaction,
        id: `trans-${accountId}-${accountTransactions.length + 1}`,
      });
      resolve(newTransaction);
    }, 500);
  });
};

export const mockGetStatement = (
  accountId: string,
  token: string
): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("Não autorizado"));
      return;
    }
    setTimeout(() => {
      // Filter transactions by accountId more reliably
      const accountTransactions = mockTransactions.filter(
        (tx) =>
          tx.id.startsWith(`trans-${accountId}-`) ||
          (tx as any).contaId === accountId
      );
      resolve(
        accountTransactions.sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        )
      );
    }, 500);
  });
};

// Seed initial data for testing
const seedInitialData = () => {
  if (mockUsers.length === 0) {
    const initialUser: User = {
      id: "user-seed",
      nome: "João Silva",
      cpf: "11122233344",
      telefone: "999998888",
    };
    mockUsers.push(initialUser);
    existingCpfs.add(initialUser.cpf);

    const acc1Num = generateAccountNumber(initialUser.nome.split(" ")[0]);
    const acc1: Account = {
      id: `acc-seed1-${initialUser.id}`,
      numero: acc1Num,
      saldo: 1500,
    };
    mockAccounts.push(acc1);
    existingAccountNumbers.add(acc1Num);

    const acc2Num = generateAccountNumber(initialUser.nome.split(" ")[0]);
    const acc2: Account = {
      id: `acc-seed2-${initialUser.id}`,
      numero: acc2Num,
      saldo: 300,
    };
    mockAccounts.push(acc2);
    existingAccountNumbers.add(acc2Num);

    // Seed some transactions for the first account
    mockCreateTransaction(acc1.id, TransactionType.DEBITO, 50, "mock-token");
    mockCreateTransaction(acc1.id, TransactionType.CREDITO, 200, "mock-token");
    mockCreateTransaction(acc1.id, TransactionType.DEBITO, 100, "mock-token");
  }
};

seedInitialData();
