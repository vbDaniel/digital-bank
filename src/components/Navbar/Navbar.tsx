import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Navbar.module.css";
import Link from "next/link";

interface NavbarProps {
  onNavigate: (
    section: "accounts" | "withdraw" | "deposit" | "statement" | "newAccount"
  ) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  const getFirstName = () => {
    if (user && user.nome) {
      return user.nome.split(" ")[0];
    }
    return "Cliente";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>Banco Digital</div>
      <div className={styles.userInfo}>Olá, {getFirstName()}</div>
      <ul className={styles.navLinks}>
        <li>
          <button onClick={() => onNavigate("accounts")}>Minhas Contas</button>
        </li>
        <li>
          <button onClick={() => onNavigate("newAccount")}>Nova Conta</button>
        </li>
        {/* <li>
          <button onClick={() => onNavigate("deposit")}>Depósito</button>
        </li>
        <li>
          <button onClick={() => onNavigate("withdraw")}>Saque</button>
        </li>
        <li>
          <button onClick={() => onNavigate("statement")}>Extrato</button>
        </li> */}
      </ul>
      <button onClick={logout} className={styles.logoutButton}>
        Sair
      </button>
    </nav>
  );
};

export default Navbar;
