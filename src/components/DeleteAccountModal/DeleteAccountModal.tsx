import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiDeleteAccount } from "src/app/dashboard/dash.utils";
import { Account } from "types";
import styles from "./DeleteAccountModal.module.css";

interface DeleteAccountModalProps {
  account: Account;
  onAccountDeleted: (deletedAccountId: string) => void;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  account,
  onAccountDeleted,
  onClose,
}) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiDeleteAccount(token, account.id);
      onAccountDeleted(account.id);
      alert(`Conta ${account.numero} deletada com sucesso!`);
      onClose();
    } catch (err: any) {
      setError("Erro ao deletar conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <p>Tem certeza de que deseja deletar a conta corrente abaixo?</p>
      <p>
        <strong>Número da conta:</strong> {account.numero}
      </p>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className={`${styles.button} ${styles.confirmButton}`}
        >
          {isLoading ? "Deletando..." : "Confirmar Exclusão"}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`${styles.button} ${styles.cancelButton}`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
