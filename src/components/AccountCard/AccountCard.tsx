import React from "react";
import styles from "./AccountCard.module.css";
import { Account } from "types";

// Ícones do MUI
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Extrato
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Depósito
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; // Saque

interface AccountCardProps {
  account: Account;
  onStatement: (account: Account) => void;
  onDeposit: (account: Account) => void;
  onWithdraw: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onStatement,
  onDeposit,
  onWithdraw,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.accountNumber}>Conta: {account.numero}</h3>
      <p className={styles.balance}>
        Saldo: R$ {account.saldo.toFixed(2).replace(".", ",")}
      </p>
      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          title="Ver Extrato"
          onClick={() => onStatement(account)}
        >
          <ReceiptLongIcon color="primary" />
        </button>
        <button
          className={styles.iconButton}
          title="Depositar"
          onClick={() => onDeposit(account)}
        >
          <AddCircleOutlineIcon color="success" />
        </button>
        <button
          className={styles.iconButton}
          title="Sacar"
          onClick={() => onWithdraw(account)}
        >
          <RemoveCircleOutlineIcon color="error" />
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
