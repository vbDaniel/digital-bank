import React, { useState, FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Account, Transaction, TransactionType } from "types";
import styles from "./AdjustLimitForm.module.css";
import { apiCreateTransaction } from "src/app/dashboard/dash.utils";
import { formatReais } from "utils/format";

interface TransactionFormProps {
  account: Account;
  transactionType: TransactionType;
  onTransactionSuccess: (
    updatedAccount: Account,
    transaction: Transaction
  ) => void;
  onClose: () => void;
}

const AdjustLimitForm: React.FC<TransactionFormProps> = ({
  account,
  transactionType,
  onTransactionSuccess,
  onClose,
}) => {
  const { token } = useAuth();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Por favor, insira um valor válido.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { updatedAccount, transaction } = await apiCreateTransaction(
        token,
        account.id,
        transactionType.toUpperCase() as "AJUSTE_LIMITE",
        value
      );

      onTransactionSuccess(updatedAccount, transaction);

      alert(
        `Operação de NOVO LIMITE de ${formatReais(
          value
        )} realizada com sucesso!`
      );
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao realizar a operação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <p>
        Conta selecionada: <strong>{account.numero}</strong>
      </p>
      <p>
        Saldo atual: <strong>{formatReais(account.saldo)}</strong>
      </p>
      <p>
        Limite atual: <strong>{formatReais(account.limite || 0)}</strong>
      </p>
      <div className={styles.inputGroup}>
        <label htmlFor="amount">
          Valor do{" "}
          {transactionType === TransactionType.CREDITO
            ? "Depósito"
            : transactionType === TransactionType.AJUSTE_LIMITE
            ? "novo limite"
            : "Saque"}
          :
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
          placeholder="0,00"
          className={styles.inputField}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} ${styles.confirmButton}`}
        >
          {isLoading
            ? "Processando..."
            : transactionType === TransactionType.CREDITO
            ? "Confirmar Depósito"
            : transactionType === TransactionType.AJUSTE_LIMITE
            ? "Confirmar Ajuste de Limite"
            : "Confirmar Saque"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className={`${styles.button} ${styles.cancelButton}`}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AdjustLimitForm;
