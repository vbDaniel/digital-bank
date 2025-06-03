import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { mockCreateAccount } from "../../../services/mockApi";
import { Account } from "types";
import styles from "./NewAccountForm.module.css";
import { apiCreateAccount } from "src/app/dashboard/dash.utils";

interface NewAccountFormProps {
  onAccountCreated: (newAccount: Account) => void;
  onClose: () => void;
}

const NewAccountForm: React.FC<NewAccountFormProps> = ({
  onAccountCreated,
  onClose,
}) => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    if (!user || !token) {
      setError("Usuário não autenticado.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newAccount = await apiCreateAccount(token, user.nome);
      onAccountCreated(newAccount);
      alert(`Conta ${newAccount.numero} criada com sucesso!`);
      onClose();
    } catch (err: any) {
      setError("Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <p>Tem certeza de que deseja criar uma nova conta corrente?</p>
      <p>O número da conta será gerado automaticamente.</p>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button
          onClick={handleCreateAccount}
          disabled={isLoading}
          className={`${styles.button} ${styles.confirmButton}`}
        >
          {isLoading ? "Criando..." : "Confirmar Criação"}
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

export default NewAccountForm;
