"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { useAuth } from "../../contexts/AuthContext";

import { Account, Transaction, TransactionType } from "../../../types";

import Navbar from "@/components/Navbar/Navbar";
import AccountCard from "@/components/AccountCard/AccountCard";
import Modal from "src/components/modals/Modal/Modal";
import NewAccountForm from "@/components/NewAccountForm/NewAccountForm";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import StatementView from "@/components/StatementView/StatementView";

import styles from "./page.module.css";
import { apiGetAccounts } from "./dash.utils";
import DeleteAccountModal from "src/components/DeleteAccountModal/DeleteAccountModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatReais } from "utils/format";
import AdjustLimitForm from "src/components/AdjustLimitForm/AdjustLimitForm";
import TransferForm from "src/components/TransferForm/TransferForm";

type ModalType =
  | "newAccount"
  | "deleteAccount"
  | "deposit"
  | "withdraw"
  | "statement"
  | "adjustLimit"
  | "transfer"
  | null;

const DashboardPage: React.FC = () => {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const queryClient = useQueryClient();

  const {
    data: accounts = [],
    isFetching,
    isLoading: isLoadingAccounts,
    error,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiGetAccounts(token!),
    enabled: !!user && !!token,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  const handleAccountCreated = (newAccount: Account) => {
    queryClient.setQueryData<Account[]>(["accounts"], (oldAccounts = []) => [
      ...oldAccounts,
      newAccount,
    ]);
    setActiveModal(null);
  };

  const handleAccountDeleted = (deletedAccountId: string) => {
    queryClient.setQueryData<Account[]>(["accounts"], (oldAccounts = []) =>
      oldAccounts.filter((acc) => String(acc.id) !== String(deletedAccountId))
    );
    setActiveModal(null);
  };

  const handleTransactionSuccess = (
    updatedAccount: Account,
    _transaction: Transaction
  ) => {
    queryClient.setQueryData<Account[]>(
      ["accounts"],
      (oldAccounts: Account[] | undefined) =>
        (oldAccounts ?? []).map((acc: Account) =>
          acc.id.toString() === updatedAccount.id.toString()
            ? updatedAccount
            : acc
        )
    );
    setSelectedAccount(updatedAccount);
    setActiveModal(null);
  };

  const handleTransferSuccess = (
    updatedAccount: Account,
    destino: Account,
    _transaction: Transaction
  ) => {
    queryClient.setQueryData<Account[]>(
      ["accounts"],
      (oldAccounts: Account[] | undefined) =>
        (oldAccounts ?? []).map((acc: Account) => {
          if (acc.id.toString() === updatedAccount.id.toString()) {
            return updatedAccount;
          }
          if (acc.id.toString() === destino.id.toString()) {
            return destino;
          }
          return acc;
        })
    );
    setSelectedAccount(updatedAccount);
    setActiveModal(null);
  };

  const handleNavigation = (
    section: "accounts" | "withdraw" | "deposit" | "statement" | "newAccount"
  ) => {
    if (section === "newAccount") {
      setActiveModal("newAccount");
    } else if (
      section === "deposit" ||
      section === "withdraw" ||
      section === "statement"
    ) {
      if (accounts.length === 0) {
        alert(
          "Você não possui contas para esta operação. Crie uma conta primeiro."
        );
        return;
      }
      alert("Selecione uma conta da lista abaixo para realizar esta operação.");
    }
  };

  const openTransactionModal = (
    type:
      | "deleteAccount"
      | "deposit"
      | "withdraw"
      | "statement"
      | "adjustLimit"
      | "transfer",
    account: Account
  ) => {
    setSelectedAccount(account);
    setActiveModal(type);
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  console.log("Accounts:", accounts);
  const renderModalContent = () => {
    if (!activeModal) return null;

    switch (activeModal) {
      case "deleteAccount":
        if (!selectedAccount) return <p>Selecione uma conta para deletar.</p>;
        return (
          <DeleteAccountModal
            account={selectedAccount}
            onAccountDeleted={handleAccountDeleted} // <-- handler correto!
            onClose={() => setActiveModal(null)}
          />
        );
      case "newAccount":
        return (
          <NewAccountForm
            onAccountCreated={handleAccountCreated}
            onClose={() => setActiveModal(null)}
          />
        );
      case "deposit":
        if (!selectedAccount) return <p>Selecione uma conta para depósito.</p>;
        return (
          <TransactionForm
            account={selectedAccount}
            transactionType={TransactionType.CREDITO}
            onTransactionSuccess={handleTransactionSuccess}
            onClose={() => setActiveModal(null)}
          />
        );
      case "withdraw":
        if (!selectedAccount) return <p>Selecione uma conta para saque.</p>;
        return (
          <TransactionForm
            account={selectedAccount}
            transactionType={TransactionType.DEBITO}
            onTransactionSuccess={handleTransactionSuccess}
            onClose={() => setActiveModal(null)}
          />
        );
      case "adjustLimit":
        if (!selectedAccount) return <p>Selecione uma conta para saque.</p>;
        return (
          <AdjustLimitForm
            account={selectedAccount}
            transactionType={TransactionType.AJUSTE_LIMITE}
            onTransactionSuccess={handleTransactionSuccess}
            onClose={() => setActiveModal(null)}
          />
        );
      case "transfer":
        if (!selectedAccount) return <p>Selecione uma conta para saque.</p>;
        return (
          <TransferForm
            account={selectedAccount}
            onTransferSuccess={handleTransferSuccess}
            onClose={() => setActiveModal(null)}
          />
        );
      case "statement":
        if (!selectedAccount)
          return <p>Selecione uma conta para ver o extrato.</p>;
        return <StatementView account={selectedAccount} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case "deleteAccount":
        return "Deletar essa conta";
      case "newAccount":
        return "Cadastrar Nova Conta";
      case "deposit":
        return "Realizar Depósito";
      case "withdraw":
        return "Realizar Saque";
      case "statement":
        return "Consultar Extrato";
      case "adjustLimit":
        return "Ajustar Limite";
      case "transfer":
        return "Realizar Transferência";
      default:
        return "";
    }
  };

  // Soma o saldo de todas as contas
  const totalSaldoAccounts = accounts.reduce(
    (total, acc) => total + (typeof acc.saldo === "number" ? acc.saldo : 0),
    0
  );

  return (
    <>
      <Head>
        <title>Dashboard - Banco Digital</title>
      </Head>
      <div className={styles.dashboardLayout}>
        <Navbar onNavigate={handleNavigation} />
        <main className={styles.mainContent}>
          <header className={styles.pageHeader}>
            <div>
              <h2>Minhas Contas</h2>
              <p>Visualize suas contas e realize operações.</p>
            </div>
            <span>{`Total de todas as contas ${formatReais(
              totalSaldoAccounts
            )}`}</span>
          </header>

          {isLoadingAccounts ||
            (isFetching && (
              <p className={styles.loadingMessage}>Carregando contas...</p>
            ))}

          {error && (
            <pre className={styles.errorMessage}>
              {typeof error === "string"
                ? error
                : error instanceof Error
                ? error.message
                : JSON.stringify(error)}
            </pre>
          )}

          {!isLoadingAccounts &&
            !error &&
            (accounts.length === 0 ? (
              <div className={styles.noAccounts}>
                <p>Você ainda não possui contas cadastradas.</p>
                <button
                  onClick={() => setActiveModal("newAccount")}
                  className={styles.actionButton}
                >
                  Criar Nova Conta
                </button>
              </div>
            ) : (
              <div className={styles.accountsGrid}>
                {accounts.map((account) => (
                  <AccountCard
                    key={account?.id}
                    account={account}
                    onStatement={(account: Account) => {
                      openTransactionModal("statement", account);
                    }}
                    onDeposit={(account: Account) => {
                      openTransactionModal("deposit", account);
                    }}
                    onWithdraw={(account: Account) => {
                      openTransactionModal("withdraw", account);
                    }}
                    onDelete={(account: Account) => {
                      openTransactionModal("deleteAccount", account);
                    }}
                    onAdjustLimit={(account: Account) => {
                      openTransactionModal("adjustLimit", account);
                    }}
                    onTransfer={(account: Account) => {
                      openTransactionModal("transfer", account);
                    }}
                  />
                ))}
              </div>
            ))}
        </main>
      </div>

      <Modal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default DashboardPage;
