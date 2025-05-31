"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { useAuth } from "../../contexts/AuthContext";

import { Account, Transaction, TransactionType } from "../../../types";

import Navbar from "@/components/Navbar/Navbar";
import AccountCard from "@/components/AccountCard/AccountCard";
import Modal from "@/components/Modal/Modal";
import NewAccountForm from "@/components/NewAccountForm/NewAccountForm";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import StatementView from "@/components/StatementView/StatementView";

import styles from "./page.module.css";
import { apiGetAccounts } from "./dash.utils";

type ModalType = "newAccount" | "deposit" | "withdraw" | "statement" | null;

const DashboardPage: React.FC = () => {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (user && token) {
      setIsLoadingAccounts(true);
      setError(null);
      try {
        const userAccounts = await apiGetAccounts(token);
        setAccounts(userAccounts);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar contas.");
      } finally {
        setIsLoadingAccounts(false);
      }
    }
  }, [user, token]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    } else if (user) {
      fetchAccounts();
    }
  }, [user, authLoading, router, fetchAccounts]);

  const handleAccountCreated = (newAccount: Account) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleTransactionSuccess = (
    updatedAccount: Account,
    _transaction: Transaction
  ) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc?.id === updatedAccount?.id ? updatedAccount : acc
      )
    );
    setSelectedAccount(updatedAccount);
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
    type: "deposit" | "withdraw" | "statement",
    account: Account
  ) => {
    setSelectedAccount(account);
    setActiveModal(type);
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  const renderModalContent = () => {
    if (!activeModal) return null;

    switch (activeModal) {
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
      case "newAccount":
        return "Cadastrar Nova Conta";
      case "deposit":
        return "Realizar Depósito";
      case "withdraw":
        return "Realizar Saque";
      case "statement":
        return "Consultar Extrato";
      default:
        return "";
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Banco Digital</title>
      </Head>
      <div className={styles.dashboardLayout}>
        <Navbar onNavigate={handleNavigation} />
        <main className={styles.mainContent}>
          <header className={styles.pageHeader}>
            <h2>Minhas Contas</h2>
            <p>Visualize suas contas e realize operações.</p>
          </header>

          {isLoadingAccounts && (
            <p className={styles.loadingMessage}>Carregando contas...</p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}

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
