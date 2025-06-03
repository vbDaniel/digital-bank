import { useState, MouseEvent } from "react";
import { Button } from "@/components/buttons";

import { ChevronDown } from "src/assets";

import styles from "./ProfileConfig.module.css";

import { useAuth } from "../../contexts/AuthContext";
import { MenuModal } from "../modals";
import { MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGlobal } from "src/contexts/GlobalContext";
import EditClientForm from "../EditClientForm/EditClientForm";
import { Account, Transaction } from "types";

export default function ProfileConfig() {
  const { openModal } = useGlobal();
  const { user, logout } = useAuth();
  const [openLogout, setOpenLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickLogout = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenLogout(!openLogout);
  };

  const handleActionClick = () => {
    logout();
  };

  const handleUpdateProfile = () => {
    openModal(<EditClientForm />, "Editar Perfil");
  };

  return (
    <div className={styles.headerContainer}>
      <MenuModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
        anchorEl={anchorEl}
        handleActionClick={handleActionClick}
        header={
          <Button
            id="profile-button"
            aria-controls={openLogout ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openLogout ? "true" : undefined}
            onClick={handleClickLogout}
          >
            <div className={styles.profileIcon}>
              {user?.nome?.[0]?.toUpperCase()}
            </div>
            <div className={styles.profileName}>
              <span>{user?.nome?.split(" ").slice(0, 2).join(" ")}</span>
              <ChevronDown />
            </div>
          </Button>
        }
      >
        <MenuItem
          onClick={handleUpdateProfile}
          className={styles.menuItemCustom}
        >
          <span>Atualizar Dados</span>
          <EditIcon className={styles.editIcon} style={{ marginLeft: 8 }} />
        </MenuItem>
        <MenuItem onClick={handleActionClick} className={styles.menuItemCustom}>
          <span>Sair</span>
          <LogoutIcon className={styles.editIcon} />
        </MenuItem>
      </MenuModal>
    </div>
  );
}
