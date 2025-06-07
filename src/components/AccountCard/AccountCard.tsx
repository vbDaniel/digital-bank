import React from "react";
import styles from "./AccountCard.module.css";
import { Account } from "types";

// Ícones do MUI
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Extrato
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Depósito
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; // Saque
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CachedIcon from "@mui/icons-material/Cached";

import { formatReais } from "utils/format";

interface AccountCardProps {
  account: Account;
  onDelete: (account: Account) => void;
  onStatement: (account: Account) => void;
  onDeposit: (account: Account) => void;
  onWithdraw: (account: Account) => void;
  onAdjustLimit: (account: Account) => void;
  onTransfer: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDelete,
  onStatement,
  onDeposit,
  onWithdraw,
  onAdjustLimit,
  onTransfer,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.accountNumber}>
        <span> Conta: {account.numero}</span>
        <button
          className={styles.iconButton}
          title="Deletar Conta"
          onClick={() => onDelete(account)}
        >
          <DeleteOutlineIcon className={styles.deleteIcon} />
        </button>
      </h3>
      <p className={styles.balance}>Saldo: {formatReais(account.saldo)}</p>
      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          title="Ver Extrato"
          onClick={() => onStatement(account)}
        >
          <ReceiptLongIcon color="info" />
          <span className={styles.buttonLabel}>Extrato</span>
        </button>
        <button
          className={styles.iconButton}
          title="Depositar"
          onClick={() => onDeposit(account)}
        >
          <AddCircleOutlineIcon color="success" />
          <span className={styles.buttonLabel}>Depositar</span>
        </button>
        <button
          className={styles.iconButton}
          title="Sacar"
          onClick={() => onWithdraw(account)}
        >
          <RemoveCircleOutlineIcon color="error" />
          <span className={styles.buttonLabel}>Sacar</span>
        </button>
        <button
          className={styles.iconButton}
          title="Ajustar Limite"
          onClick={() => {
            onAdjustLimit(account);
          }}
        >
          <AccountBalanceWalletIcon color="primary" />
          <span className={styles.buttonLabel}>Ajuste seu limite</span>
        </button>
        <button
          className={styles.iconButton}
          title="Ajustar Limite"
          onClick={() => {
            onTransfer(account);
          }}
        >
          <CachedIcon color="secondary" />
          <span className={styles.buttonLabel}>Transferir</span>
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
