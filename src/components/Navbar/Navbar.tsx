import React from "react";

import styles from "./Navbar.module.css";
import ProfileConfig from "../profile-config/ProfileConfig";
import { Button } from "../buttons";

import LogoDigital from "../../assets/image/logoDigital.png";

interface NavbarProps {
  onNavigate: (
    section: "accounts" | "withdraw" | "deposit" | "statement" | "newAccount"
  ) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <img src={LogoDigital.src} alt="Logo" />
      </div>

      <Button
        onClick={() => onNavigate("newAccount")}
        variant="filled"
        classStyle={styles.newAccountButton}
      >
        Nova Conta
      </Button>

      <ProfileConfig />
    </nav>
  );
};

export default Navbar;
