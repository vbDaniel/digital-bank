import React, { useState, FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Account, Transaction } from "types";
import styles from "./TransferForm.module.css";
import {
  apiCreateTransfer,
  apiGetAllAccounts,
} from "src/app/dashboard/dash.utils";
import { formatReais } from "utils/format";
import { useQuery } from "@tanstack/react-query";

interface TransferFormProps {
  account: Account; // Conta origem
  onTransferSuccess: (
    updatedAccount: Account,
    destino: Account,
    transaction: Transaction
  ) => void;
  onClose: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({
  account,
  onTransferSuccess,
  onClose,
}) => {
  const { token } = useAuth();
  const [amount, setAmount] = useState("");
  const [destAccountId, setDestAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts-all"],
    queryFn: () => apiGetAllAccounts(token!),
  });

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
    if (!destAccountId) {
      setError("Selecione a conta de destino.");
      return;
    }
    if (destAccountId === account.id) {
      setError("Selecione uma conta de destino diferente da origem.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { updatedAccount, destino, transaction } = await apiCreateTransfer(
        token,
        account.id,
        destAccountId,
        value
      );
      onTransferSuccess(updatedAccount, destino, transaction);
      alert(`Transferência de ${formatReais(value)} realizada com sucesso!`);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao realizar a transferência.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <p>
        Conta origem: <strong>{account.numero}</strong>
      </p>
      <p>
        Saldo atual: <strong>{formatReais(account.saldo)}</strong>
      </p>
      <p>
        Limite atual: <strong>{formatReais(account.limite || 0)}</strong>
      </p>
      <p>
        <strong>
          {destAccountId && destAccountId !== account.id
            ? "Atenção: será cobrada uma taxa de 10% para transferências para contas de outros usuários."
            : ""}
        </strong>
      </p>
      <div className={styles.inputGroup}>
        <label htmlFor="destAccount">Conta de destino:</label>
        <select
          id="destAccount"
          value={destAccountId}
          onChange={(e) => setDestAccountId(e.target.value)}
          required
          className={styles.inputField}
        >
          <option value="">Selecione</option>
          {accounts
            .filter((acc) => acc.id !== account.id)
            .map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.numero} - {acc?.cliente?.nome} - {acc?.cliente?.cpf} -{" "}
                {acc?.cliente?.telefone}
              </option>
            ))}
        </select>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="amount">Valor da transferência:</label>
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
          {isLoading ? "Processando..." : "Confirmar Transferência"}
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

export default TransferForm;
