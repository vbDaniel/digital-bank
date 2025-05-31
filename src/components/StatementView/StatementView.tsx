import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Account, Transaction, TransactionType } from "types";
import styles from "./StatementView.module.css";
import { apiGetStatement } from "src/app/dashboard/dash.utils";

interface StatementViewProps {
  account: Account;
}

const StatementView: React.FC<StatementViewProps> = ({ account }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatement = async () => {
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const statementData = await apiGetStatement(token, account.id);
        setTransactions(statementData);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar extrato.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatement();
  }, [account.id, token]);

  return (
    <div className={styles.statementContainer}>
      <p>
        Conta: <strong>{account.numero}</strong>
      </p>
      <p>
        Saldo Atual: <strong>R$ {account.saldo.toFixed(2)}</strong>
      </p>
      {isLoading && <p>Carregando extrato...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!isLoading &&
        !error &&
        (transactions.length === 0 ? (
          <p>Nenhuma transação encontrada para esta conta.</p>
        ) : (
          <ul className={styles.transactionList}>
            {transactions.map((tx) => (
              <li
                key={tx?.id}
                className={`${styles.transactionItem} ${
                  tx.tipo === TransactionType.CREDITO
                    ? styles.credit
                    : styles.debit
                }`}
              >
                <span className={styles.date}>
                  {new Date(tx.data).toLocaleDateString("pt-BR")}
                </span>
                <span className={styles.description}>
                  {tx.descricao ||
                    (tx.tipo === TransactionType.CREDITO
                      ? "Crédito"
                      : "Débito")}
                </span>
                <span className={styles.amount}>
                  {tx.tipo === TransactionType.DEBITO ? "-" : "+"} R${" "}
                  {tx.valor.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
};

export default StatementView;
