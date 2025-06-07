import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Account, Transaction, TransactionType } from "types";
import styles from "./StatementView.module.css";
import { apiGetStatement } from "src/app/dashboard/dash.utils";
import { formatReais } from "utils/format";

interface StatementViewProps {
  account: Account;
}

const StatementView: React.FC<StatementViewProps> = ({ account }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");

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
        setError("Erro ao buscar extrato.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatement();
  }, [account.id, token]);

  const filteredTransactions = transactions.filter((tx) => {
    if (tx.tipo.toLowerCase() === TransactionType.AJUSTE_LIMITE.toLowerCase())
      return false;

    if (
      filterType !== "all" &&
      tx.tipo.toLowerCase() !== filterType.toLowerCase()
    ) {
      return false;
    }

    if (search.trim() === "") return true;

    if (formatReais(tx.valor).includes(search)) return true;

    const dataStr = new Date(tx.data).toLocaleDateString("pt-BR");
    if (dataStr.includes(search)) return true;

    return false;
  });

  const Item = (tx: Transaction) => {
    let tipoLabel = "";
    let tipoClass = "";
    let sinal = "";

    switch (tx.tipo.toLowerCase()) {
      case TransactionType.CREDITO:
        tipoLabel = "Crédito";
        tipoClass = styles.credit;
        sinal = "+ ";
        break;
      case TransactionType.DEBITO:
        tipoLabel = "Débito";
        tipoClass = styles.debit;
        sinal = "- ";
        break;
      case "bonus":
        tipoLabel = "Bônus";
        tipoClass = styles.bonus || styles.credit;
        sinal = "+ ";
        break;
      case "transferencia_debito":
        tipoLabel = "Transferência Enviada";
        tipoClass = styles.debit;
        sinal = "- ";
        break;
      case "transferencia_credito":
        tipoLabel = "Transferência Recebida";
        tipoClass = styles.credit;
        sinal = "+ ";
        break;
      default:
        tipoLabel = tx.tipo;
        tipoClass = "";
        sinal = "";
    }

    return (
      <li key={tx.id} className={`${styles.transactionItem} ${tipoClass}`}>
        <span className={styles.date}>
          {new Date(tx.data).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
        <span className={styles.description}>{tx.descricao || tipoLabel}</span>
        <span className={styles.amount}>
          {sinal}
          {formatReais(Math.abs(tx.valor))}
        </span>
      </li>
    );
  };

  return (
    <div className={styles.statementContainer}>
      <p>
        Conta: <strong>{account.numero}</strong>
      </p>
      <p>
        Saldo Atual: <strong>{formatReais(account.saldo)}</strong>
      </p>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Pesquisar por valor ou data"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className={styles.typeSelect}
        >
          <option value="all">Todos</option>
          <option value={TransactionType.CREDITO}>Crédito</option>
          <option value={TransactionType.DEBITO}>Débito</option>
        </select>
      </div>
      <div className={styles.transactionsList}>
        {isLoading && <p>Carregando extrato...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!isLoading &&
          !error &&
          (filteredTransactions.length === 0 ? (
            <p>Nenhuma transação encontrada para esta conta.</p>
          ) : (
            <ul className={styles.transactionList}>
              {filteredTransactions.map((tx) => (
                <Item key={tx.id} {...tx} />
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
};

export default StatementView;
